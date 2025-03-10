const { Pinecone } = require("@pinecone-database/pinecone");
require("dotenv").config();

async function testConnection() {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });

    const indexes = await pinecone.listIndexes();
    console.log("✅ Available Indexes:", indexes);

    if (indexes.includes(process.env.PINECONE_INDEX)) {
      console.log(`✅ Index "${process.env.PINECONE_INDEX}" found.`);
    } else {
      console.error(`❌ Index "${process.env.PINECONE_INDEX}" NOT found!`);
    }
  } catch (error) {
    console.error("❌ Pinecone Connection Error:", error.message);
  }
}

testConnection();

