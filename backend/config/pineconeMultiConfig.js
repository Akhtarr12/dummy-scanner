const { Pinecone } = require('@pinecone-database/pinecone');

async function createPineconeClients() {
  try {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });

    const projectId = process.env.PINECONE_PROJECT_ID;
    const environment = process.env.PINECONE_ENVIRONMENT;

    // Initialize both indexes
    const index1 = pc.index({
      name: process.env.PINECONE_INDEX,
      host: `https://${process.env.PINECONE_INDEX}-${projectId}.svc.${environment}.pinecone.io`
    });

    const index2 = pc.index({
      name: process.env.PINECONE_INDEX_2,
      host: `https://${process.env.PINECONE_INDEX_2}-${projectId}.svc.${environment}.pinecone.io`
    });

    return {
      index1,
      index2
    };
  } catch (error) {
    console.error("Failed to initialize Pinecone clients:", error);
    throw error;
  }
}

module.exports = createPineconeClients; 