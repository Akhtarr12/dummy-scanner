const { Pinecone } = require('@pinecone-database/pinecone');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
require('dotenv').config();

async function testPineconeQuery() {
  try {
    // Initialize
    const pinecone = new Pinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX);
    const embeddings = new OpenAIEmbeddings();

    // Test queries
    const testQueries = [
      "chickenpox treatment",
      "skin infection cure",
      "ayurvedic medicine for skin"
    ];

    for (const query of testQueries) {
      console.log(`\nTesting query: "${query}"`);
      const queryEmbedding = await embeddings.embedQuery(query);

      // Try both namespaces
      for (const namespace of ['namespace', 'namespace_ayurved']) {
        const response = await index.query({
          vector: queryEmbedding,
          topK: 3,
          includeMetadata: true,
          namespace: namespace
        });

        console.log(`\nResults for ${namespace}:`);
        console.log(`Found ${response.matches?.length || 0} matches`);
        if (response.matches) {
          response.matches.forEach((match, i) => {
            console.log(`\nMatch ${i + 1}:`);
            console.log(`Score: ${match.score}`);
            console.log(`Text: ${match.metadata?.text || 'No text'}`);
          });
        }
      }
    }

  } catch (error) {
    console.error("Test failed:", error);
  }
}

testPineconeQuery(); 