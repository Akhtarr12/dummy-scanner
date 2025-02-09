const { PineconeClient } = require("@pinecone-database/pinecone");
const { OpenAI } = require("openai");
require("dotenv").config();

// Initialize Pinecone
const pinecone = new PineconeClient();
pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENV,
});
const index = pinecone.Index("chatbot-index");

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to get AI response
async function getOpenAIResponse(userMessage) {
    try {
        // Pinecone Vector Search
        const queryVector = await openai.embeddings.create({
            input: userMessage,
            model: "text-embedding-ada-002",
        });

        const queryResponse = await index.query({
            vector: queryVector.data[0].embedding,
            topK: 3,
            includeMetadata: true,
        });

        let context = queryResponse.matches.map(match => match.metadata.text).join("\n");

        // OpenAI Chat Completion
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful chatbot assistant." },
                { role: "user", content: context + "\n" + userMessage },
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error:", error);
        return "Sorry, I couldn't process your request.";
    }
}

module.exports = { getOpenAIResponse };
