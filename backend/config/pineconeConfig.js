const { Pinecone } = require('@pinecone-database/pinecone');

async function createPineconeClient() {
  try {
    console.log("Initializing Pinecone client...");
    
    const indexName = process.env.PINECONE_INDEX;

    console.log("Using configuration:");
    console.log(`Index: ${indexName}`);

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });

    const index = pinecone.Index(indexName);

    // Verify connection and check index stats
    try {
      const stats = await index.describeIndexStats();
      console.log("\nIndex Statistics:");
      console.log(`Total vector count: ${stats.totalVectorCount}`);
      console.log("Namespaces:", stats.namespaces);

      // Test query
      const testQuery = {
        vector: new Array(384).fill(0),
        topK: 1,
        includeMetadata: true,
        filter: {
          namespace: process.env.PINECONE_NAMESPACE
        }
      };

      await index.query(testQuery);
      console.log(`✅ Connected to Pinecone index "${indexName}"`);
      return index;
    } catch (queryError) {
      console.error("Failed to connect to index:", queryError);
      throw queryError;
    }

  } catch (error) {
    console.error("\n❌ Pinecone Error Details:");
    console.error(`Error Type: ${error.constructor.name}`);
    console.error(`Error Message: ${error.message}`);
    
    console.log("\n🔍 Troubleshooting Guide:");
    console.log("1. Environment Check:");
    console.log(`   PINECONE_API_KEY: ${process.env.PINECONE_API_KEY ? '✓ Present' : '✗ Missing'}`);
    console.log(`   PINECONE_INDEX: ${process.env.PINECONE_INDEX}`);
    console.log(`   PINECONE_ENVIRONMENT: ${process.env.PINECONE_ENVIRONMENT}`);
    console.log(`   PINECONE_PROJECT_ID: ${process.env.PINECONE_PROJECT_ID}`);
    
    throw error;
  }
}

module.exports = createPineconeClient;
