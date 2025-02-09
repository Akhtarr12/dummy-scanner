// backend/DermaChatBot.js
const { OpenAI } = require("openai");
const createPineconeClient = require("./config/pineconeConfig");
const openaiClient = require("./config/openaiConfig");
const { getEmbeddings } = require("./embeddings");
const PineconeHybridSearchRetriever = require("./retrievers/pineconeHybridSearchRetriever");
const bm25EncoderNew = require("./utils/bm25EncoderNew");
const bm25EncoderAyurved = require("./utils/bm25EncoderAyurved");
const BM25EncoderManager = require("./utils/bm25EncoderManager");

const bm25Manager = new BM25EncoderManager('./data/bm25_values_new.json');
bm25Manager.loadEncoder();

class DermaChatBot {
  constructor(openaiKey, pineconeApiKey, indexName, namespace, namespace2) {
    this.convoHistory = [];
    this.indexName = indexName;
    this.namespace = namespace;
    this.namespace2 = namespace2;
    this.alpha = 0.5;
    this.MAX_HISTORY = 10;

    // Initialize OpenAI client
    this.openaiClient = new OpenAI({
      apiKey: openaiKey
    });

    // Verify OpenAI client
    this.verifyOpenAIClient();

    // Initialize Pinecone
    createPineconeClient()
      .then((client) => {
        this.pineconeClient = client;
        this.index = client.index(indexName);
        client.listIndexes()
          .then((indexes) => {
            console.log("✅ Pinecone client initialized successfully!");
            console.log("Available indexes:", indexes);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }

  async verifyOpenAIClient() {
    try {
      if (!this.openaiClient) throw new Error("OpenAI client not initialized");
      
      const models = await this.openaiClient.models.list();
      console.log("✅ OpenAI client initialized successfully!");
      console.log("Available models:", models.data.map(m => m.id));
    } catch (err) {
      console.error("❌ OpenAI client initialization failed!", err.message);
    }
  }

  // Updated OpenAI completion method
  async createChatCompletion(messages, model = "gpt-4-0125-preview") {
    try {
      const completion = await this.openaiClient.chat.completions.create({
        model,
        messages,
        temperature: 0.7
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  }

  async fetchFromDb(query, alpha = 0.5, top_k = 3) {
    try {
      if (typeof query !== "string") throw new Error("Query must be a string!");
      
      if (this.convoHistory.length > this.MAX_HISTORY) {
        this.convoHistory = this.convoHistory.slice(-this.MAX_HISTORY);
      }

      const embeddingsInstance = await getEmbeddings();
      
      const retrieverNormal = new PineconeHybridSearchRetriever({
        embeddings: embeddingsInstance,
        sparseEncoder: bm25EncoderNew,
        alpha,
        top_k,
        index: this.index,
        namespace: this.namespace,
      });

      const retrieverAyurved = new PineconeHybridSearchRetriever({
        embeddings: embeddingsInstance,
        sparseEncoder: bm25EncoderAyurved,
        alpha,
        top_k,
        index: this.index,
        namespace: this.namespace2,
      });

      const [relevantDocsNormal, relevantDocsAyurved] = await Promise.all([
        retrieverNormal.invoke(query),
        retrieverAyurved.invoke(query)
      ]);

      const similarVectors = [
        ...relevantDocsNormal.slice(0, top_k).map((doc, i) => `TEXT_CHUNK_${i+1}: ${doc.page_content}`),
        ...relevantDocsAyurved.slice(0, top_k).map((doc, i) => `AYURVEDIC_TEXT_CHUNK_${i+1}: ${doc.page_content}`)
      ].join('\n');

      const responseText = await this.createChatCompletion([{
        role: "system",
        content: `You are a helpful medical assistant. Answer based on:
          ${similarVectors}
          - Provide separate normal and Ayurvedic solutions
          - If unsure, say "I don't know"`
      }, {
        role: "user",
        content: query
      }]);

      this.updateConversation(query, responseText);
      return responseText;
    } catch (error) {
      console.error("fetchFromDb error:", error);
      return "Error fetching data. Please try again.";
    }
  }

  async normalConvo(query) {
    try {
      const responseText = await this.createChatCompletion([
        ...this.convoHistory,
        { role: "user", content: query }
      ], "gpt-3.5-turbo");

      this.updateConversation(query, responseText);
      return responseText;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }

  updateConversation(query, response) {
    this.convoHistory.push(
      { role: "user", content: query },
      { role: "assistant", content: response }
    );
    if (this.convoHistory.length > this.MAX_HISTORY * 2) {
      this.convoHistory = this.convoHistory.slice(-this.MAX_HISTORY * 2);
    }
  }

  async checkpointCheck(query) {
    try {
      const analysis = await this.createChatCompletion([{
        role: "system",
        content: `Analyze if query needs medical data. Respond with JSON: {
          "fetch_from_db": 1|-1,
          "alpha": 0-1,
          "refined_query": "string"
        }`
      }, {
        role: "user",
        content: query
      }]);

      const resDict = JSON.parse(analysis);
      
      if (resDict.fetch_from_db === -1) {
        return this.normalConvo(resDict.refined_query);
      }
      return this.fetchFromDb(resDict.refined_query, resDict.alpha);
    } catch (error) {
      console.error("checkpointCheck error:", error);
      return this.fetchFromDb(query);
    }
  }
}

module.exports = DermaChatBot;
