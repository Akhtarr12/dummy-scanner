require("dotenv").config();
const { PineconeClient } = require("@pinecone-database/pinecone");

async function createPineconeClient() {
  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT, // e.g., "us-west1-gcp"
  });
  console.log("✅ Pinecone initialized successfully!");
  return pinecone;
}

module.exports = createPineconeClient;