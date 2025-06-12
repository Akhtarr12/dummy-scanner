// backend/embeddings.js
const { OpenAIEmbeddings } = require("@langchain/openai");

async function getEmbeddings() {
  try {
    console.log("Initializing OpenAI embeddings...");
    
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-ada-002"
    });
    
    console.log("OpenAI embeddings initialized successfully");
    return embeddings;
  } catch (error) {
    console.error("Failed to initialize embeddings:", error);
    throw error;
  }
}

async function testEmbeddings() {
  try {
    const embeddings = await getEmbeddings();
    const testQuery = "This is a test query";
    console.log(`Testing embeddings with query: "${testQuery}"`);
    
    const result = await embeddings.embedQuery(testQuery);
    console.log(`Embedding generated successfully: ${result.length} dimensions`);
    return true;
  } catch (error) {
    console.error("Embeddings test failed:", error);
    return false;
  }
}

module.exports = { getEmbeddings, testEmbeddings };