const { Pinecone } = require('@pinecone-database/pinecone');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function testQueries() {
  try {
    console.log("Initializing test...");
    
    // Initialize clients
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });
    
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX);

    // Test queries
    const testQueries = [
      "acne treatment",
      "skin infection",
      "ayurvedic medicine"
    ];

    for (const queryText of testQueries) {
      console.log(`\n\nTesting query: "${queryText}"`);
      
      // Get embeddings
      const queryEmbedding = await embeddings.embedQuery(queryText);
      console.log("Generated embedding dimension:", queryEmbedding.length);

      // Test each namespace
      for (const namespace of ['namespace', 'namespace_ayurved']) {
        console.log(`\nQuerying namespace: ${namespace}`);
        
        try {
          const response = await index.query({
            vector: queryEmbedding,
            topK: 3,
            includeMetadata: true,
            namespace: namespace
          });

          console.log(`Found ${response.matches?.length || 0} matches`);
          if (response.matches?.length > 0) {
            response.matches.forEach((match, i) => {
              console.log(`\nMatch ${i + 1}:`);
              console.log(`Score: ${match.score}`);
              console.log(`Text: ${match.metadata?.text || 'No text'}`);
            });
          }
        } catch (error) {
          console.error(`Error querying ${namespace}:`, error.message);
        }
      }
    }

  } catch (error) {
    console.error("Test failed:", error);
  }
}

testQueries(); 