const { Pinecone } = require('@pinecone-database/pinecone');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function testPineconeUpload() {
  try {
    console.log("Initializing test upload...");
    
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });
    
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX);

    // Test data
    const testData = [
      {
        text: "Acne can be treated with benzoyl peroxide, salicylic acid, and topical retinoids.",
        namespace: "namespace"
      },
      {
        text: "Ayurvedic treatment for acne includes neem, turmeric, and aloe vera.",
        namespace: "namespace_ayurved"
      }
    ];

    // Upload test vectors
    for (const data of testData) {
      const vector = await embeddings.embedQuery(data.text);
      
      await index.upsert({
        vectors: [{
          id: `test-${Date.now()}`,
          values: vector,
          metadata: { text: data.text }
        }],
        namespace: data.namespace
      });

      console.log(`Uploaded test vector to ${data.namespace}`);
    }

    // Now test search
    const queryText = "acne treatment";
    console.log(`\nTesting search for: "${queryText}"`);
    const queryVector = await embeddings.embedQuery(queryText);

    for (const namespace of ['namespace', 'namespace_ayurved']) {
      console.log(`\nSearching in ${namespace}...`);
      const response = await index.query({
        vector: queryVector,
        topK: 3,
        includeMetadata: true,
        includeValues: false,
        filter: {
          namespace: namespace
        }
      });

      console.log(`Found ${response.matches?.length || 0} matches`);
      response.matches?.forEach((match, i) => {
        console.log(`\nMatch ${i + 1}:`);
        console.log(`Score: ${match.score}`);
        console.log(`Text: ${match.metadata?.text}`);
      });
    }

  } catch (error) {
    console.error("Test failed:", error);
  }
}

testPineconeUpload(); 