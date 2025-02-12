const { Pinecone } = require('@pinecone-database/pinecone');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');

async function uploadTestVectors() {
  try {
    const pinecone = new Pinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX);
    
    // Create embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    });

    // Test data
    const testData = [
      {
        text: "Impetigo is treated with antibiotics. Common treatments include mupirocin ointment and oral antibiotics.",
        namespace: "namespace"
      },
      {
        text: "Ayurvedic treatment for skin infections includes neem, turmeric, and aloe vera.",
        namespace: "namespace_ayurved"
      }
    ];

    // Create embeddings and upload
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
    }

    console.log("✅ Test vectors uploaded successfully");
    
    // Verify upload
    const stats = await index.describeIndexStats();
    console.log("\nUpdated Index Statistics:");
    console.log(`Total vector count: ${stats.totalVectorCount}`);
    console.log("Namespaces:", stats.namespaces);

  } catch (error) {
    console.error("Failed to upload test vectors:", error);
  }
}

uploadTestVectors(); 