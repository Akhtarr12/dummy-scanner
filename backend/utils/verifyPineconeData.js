const { Pinecone } = require('@pinecone-database/pinecone');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function verifyPineconeData() {
  try {
    console.log("Initializing Pinecone verification...");
    console.log("API Key present:", !!process.env.PINECONE_API_KEY);
    
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });
    
    const index = pinecone.Index(process.env.PINECONE_INDEX);

    // Get index stats
    const stats = await index.describeIndexStats();
    console.log("\nIndex Statistics:");
    console.log(JSON.stringify(stats, null, 2));

    // Try listing vectors
    for (const namespace of ['namespace', 'namespace_ayurved']) {
      console.log(`\nChecking vectors in namespace: ${namespace}`);
      
      try {
        const response = await index.query({
          vector: new Array(384).fill(0),
          topK: 5,
          includeMetadata: true,
          filter: {
            namespace
          }
        });

        console.log(`Results: ${response.matches?.length || 0} matches`);
        if (response.matches?.length > 0) {
          console.log("First match metadata:", response.matches[0].metadata);
        }
      } catch (error) {
        console.error(`Error querying namespace ${namespace}:`, error.message);
      }
    }

  } catch (error) {
    console.error("Verification failed:", error);
    console.error("Environment variables:", {
      PINECONE_API_KEY: process.env.PINECONE_API_KEY ? 'Present' : 'Missing',
      PINECONE_INDEX: process.env.PINECONE_INDEX,
      PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT
    });
  }
}

verifyPineconeData(); 