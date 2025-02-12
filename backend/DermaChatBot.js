// backend/DermaChatBot.js
const { OpenAI } = require("openai");
const createPineconeClient = require("./config/pineconeConfig");
const openaiClient = require("./config/openaiConfig");
const { getEmbeddings } = require("./embeddings");
const PineconeHybridSearchRetriever = require("./retrievers/pineconeHybridSearchRetriever");
const bm25EncoderNew = require("./utils/bm25EncoderNew");
const bm25EncoderAyurved = require("./utils/bm25EncoderAyurved");
const BM25EncoderManager = require("./utils/bm25EncoderManager");
const BM25EncoderManager2 = require("./utils/bm25EncoderManager2");

const bm25Manager = new BM25EncoderManager('./data/bm25_values_new.json');
bm25Manager.loadEncoder();
const bm25Manager2 = new BM25EncoderManager2('./data/bm25_values_ayurved.json');
bm25Manager2.loadEncoder();

class DermaChatBot {
  constructor(openaiKey, _pineconeApiKey, indexName, namespace, namespace2) {
    this.bm25Manager = new BM25EncoderManager('./data/bm25_values_new.json');
    this.bm25Manager2 = new BM25EncoderManager2('./data/bm25_values_ayurved.json');
    try {
      bm25Manager.loadEncoder();
      bm25Manager2.loadEncoder();
    } catch (error) {
      console.error("Failed to load BM25 encoders:", error);
    }
    this.convoHistory = [];
    this.indexName = indexName;
    this.namespace = namespace === 'namespace' ? 'namespace_ayurved' : namespace;
this.namespace2 = namespace2 || 'namespace_ayurved';
    this.alpha = 0.5;
    this.MAX_HISTORY = 10;

    // Initialize OpenAI client
    this.openaiClient = new OpenAI({
      apiKey: openaiKey
    });

    // Verify OpenAI client
    this.verifyOpenAIClient();

    // Initialize Pinecone
    this.indexLoaded = createPineconeClient()
      .then((index) => {
        this.index = index;
        console.log("✅ Pinecone client initialized successfully!");
      })
      .catch((error) => {
        console.error("❌ Pinecone initialization failed:", error);
      });

    this.encoderLoaded = Promise.all([
      new Promise((resolve) => {
        this.bm25Manager.loadEncoder();
        resolve();
      }),
      new Promise((resolve) => {
        this.bm25Manager2.loadEncoder();
        resolve();
        })
      ]);
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
        temperature: 0.3, // Reduced from 0.7
        // Stop generation at double newlines
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  }

  async fetchFromDb(query, alpha = 0.5, top_k = 3) {
    try {
      console.log(`🔍 Fetching from Database: Query = "${query}"`);
      console.log(`📊 Search Parameters: alpha = ${alpha}, top_k = ${top_k}`);
      await this.encoderLoaded;
      await this.indexLoaded; 
      const embeddingsInstance = await getEmbeddings();
        
      const retriever = new PineconeHybridSearchRetriever({
          embeddings: embeddingsInstance,
          top_k,
          index: this.index
      });
      
      const relevantDocs = await retriever.invoke(query);
      
      // Log retrieved documents
      console.log(`📚 Documents Retrieved: ${relevantDocs.length}`);
      relevantDocs.forEach((doc, index) => {
          console.log(`   Doc ${index + 1} - Score: ${doc.score} - Namespace: ${doc.namespace}`);
      });
      
      const similarVectors = relevantDocs.map((doc, i) => 
          `${doc.namespace === 'namespace' ? 'MEDICAL' : 'AYURVEDIC'}[${i+1}]: ${doc.page_content}`
      ).join('\n');

        const responseText = await this.createChatCompletion([{
            role: "system",
            content: `You are a medical expert. STRICTLY follow:
1. Answer ONLY using:
${similarVectors}

2. Format:
Normal Medicine Solutions:
-------------------------
• Max 3 bullet points from MEDICAL[] context
• If none: "No modern recommendations"

Ayurvedic Solutions:
--------------------
• Max 3 bullet points from AYURVEDIC[] context
• If none: "No ayurvedic recommendations"

3. NEVER:
- Add greetings/conclusions
- Use markdown
- Suggest consulting professionals`
        }, {
            role: "user",
            content: query
        }]);
        // Log response 
        console.log(`💬 Generated Response Length: ${responseText.length} characters`);
        console.log(`🔍 Response Preview: ${responseText.substring(0, 200)}...`);

        this.updateConversation(query, responseText);
        return responseText;

    } catch (error) {
        console.error("fetchFromDb error:", error);
        return this.getFallbackResponse();
    }
}

getFallbackResponse() {
    return `Normal Medicine Solutions:\n------\nNo recommendations\n\nAyurvedic Solutions:\n-------\nNo recommendations`;
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
    console.log("checkpointCheck query:", query);
    try {
      // Remove the context from the system prompt since we don't have similarVectors
      const responseText = await this.createChatCompletion([
        {
          role: "system",
          content: `You are a medical expert assistant. Strictly follow these rules:
1. Determine if the query requires specialized medical database search
2. If specialized search is needed, return a query suitable for database retrieval
3. If general conversation is sufficient, indicate that

Respond with a JSON object with these keys:
- fetch_from_db: -1 (for normal conversation) or 1 (for database search)
- refined_query: The query to use for search or conversation
- alpha: Search alpha value (default 0.5)`
        },
        {
          role: "user",
          content: query
        }
      ], "gpt-3.5-turbo");

      // Parse the response as JSON
      const resDict = JSON.parse(responseText);
      
      if (resDict.fetch_from_db === -1) {
        return this.normalConvo(resDict.refined_query);
      } else if (resDict.fetch_from_db === 1){
      return this.fetchFromDb(resDict.refined_query, resDict.alpha);}
      else {
        return "Invalid response from the model";
      }
    } catch (error) {
      console.error("checkpointCheck error:", error);
      return this.fetchFromDb(query);
    }
}
}

module.exports = DermaChatBot;