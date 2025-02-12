const { Pinecone } = require('@pinecone-database/pinecone');
const { OpenAIEmbeddings } = require('@langchain/openai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function verifyAndFixPinecone() {
  try {
    console.log("Starting Pinecone verification and fix...");
    
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });
    
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX);

    // 1. Check current state
    const stats = await index.describeIndexStats();
    console.log("\nCurrent Index Statistics:");
    console.log(JSON.stringify(stats, null, 2));

    // Helper function to adjust vector dimensions
    function adjustVectorDimension(vector, targetDim = 384) {
      if (vector.length === targetDim) return vector;
      if (vector.length > targetDim) return vector.slice(0, targetDim);
      return [...vector, ...new Array(targetDim - vector.length).fill(0)];
    }

    // 2. Test data with medical conditions
    const testData = [
      {
        text: "Impetigo is a bacterial skin infection that causes red sores and blisters. It's typically treated with antibiotics like mupirocin ointment or oral medications.",
        namespace: "namespace"
      },
      {
        text: "Ayurvedic treatment for impetigo includes neem paste, turmeric, and honey. These natural remedies have antimicrobial properties.",
        namespace: "namespace_ayurved"
      }
    ];

    // 3. Upload test vectors with proper metadata
    console.log("\nUploading test vectors...");
    for (const data of testData) {
      try {
        const vector = await embeddings.embedQuery(data.text);
        console.log(`Generated embedding for: ${data.text.substring(0, 50)}...`);
        console.log("Original vector dimension:", vector.length);
        
        const adjustedVector = adjustVectorDimension(vector);
        console.log("Adjusted vector dimension:", adjustedVector.length);

        const vectorId = `test-${Date.now()}-${Math.random()}`;
        console.log("Upserting vector with ID:", vectorId);

        await index.upsert([{
          id: vectorId,
          values: adjustedVector,
          metadata: {
            text: data.text,
            namespace: data.namespace
          }
        }], { namespace: data.namespace });

        console.log(`✓ Uploaded to ${data.namespace}`);
        
        // Wait between uploads
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to upload vector for ${data.namespace}:`, error);
        console.error("Error details:", {
          name: error.name,
          message: error.message
        });
      }
    }

    // 4. Test searches
    const testQueries = ["impetigo treatment"];
    
    for (const queryText of testQueries) {
      console.log(`\n\nTesting search for: "${queryText}"`);
      
      try {
        const queryVector = await embeddings.embedQuery(queryText);
        console.log("Original query vector dimension:", queryVector.length);
        
        const adjustedQueryVector = adjustVectorDimension(queryVector);
        console.log("Adjusted query vector dimension:", adjustedQueryVector.length);

        for (const namespace of ['namespace', 'namespace_ayurved']) {
          console.log(`\nSearching in ${namespace}...`);
          
          const response = await index.query({
            vector: adjustedQueryVector,
            topK: 3,
            includeMetadata: true,
            namespace: namespace
          });

          console.log(`Found ${response.matches?.length || 0} matches`);
          if (response.matches?.length > 0) {
            response.matches.forEach((match, i) => {
              console.log(`\nMatch ${i + 1} (score: ${match.score}):`);
              console.log(`Text: ${match.metadata?.text}`);
            });
          }
        }
      } catch (error) {
        console.error(`Error processing query "${queryText}":`, error);
        console.error("Full error:", error);
      }
    }

    // 5. Final stats check
    const finalStats = await index.describeIndexStats();
    console.log("\nFinal Index Statistics:");
    console.log(JSON.stringify(finalStats, null, 2));

  } catch (error) {
    console.error("Verification failed:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
}

verifyAndFixPinecone(); 