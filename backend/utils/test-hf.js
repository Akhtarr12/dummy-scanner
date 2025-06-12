const axios = require('axios');
require('dotenv').config();

async function testHF() {
  try {
    console.log("Testing HF connection with token:", 
                process.env.HUGGINGFACE_API_KEY.substring(0, 5) + "...");
    
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
      { inputs: "Hello world" },
      {
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        }
      }
    );
    
    console.log("Success! Got response:", response.data ? "Data received" : "No data");
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

testHF();