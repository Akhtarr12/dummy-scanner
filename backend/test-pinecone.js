require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');

async function testConnection() {
  try {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT
    });

    const index = pc.index(process.env.PINECONE_INDEX);
    
    const describeIndex = await index.describeIndex();
    console.log('Index details:', describeIndex);
    
  } catch (error) {
    console.error('Error:', error);
  }
}
testConnection();