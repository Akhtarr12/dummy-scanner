// backend/embeddings.js
const { HuggingFaceInferenceEmbeddings } = require("@langchain/community/embeddings/hf");

async function getEmbeddings() {
  const embeddings = new HuggingFaceInferenceEmbeddings({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    apiKey: process.env.HUGGINGFACE_API_KEY
  });
  return embeddings;
}

module.exports = { getEmbeddings };