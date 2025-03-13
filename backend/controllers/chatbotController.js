const pinecone = require("../config/pineconeConfig");
const embeddings = require("../embeddings");
const BM25EncoderManager = require("../utils/bm25EncoderManager"); 

// Update the path to the BM25 values file
const bm25Manager = new BM25EncoderManager('./data/bm25_values_new.json');
bm25Manager.loadEncoder();


const handleChat = async (req, res) => {
    try {
      const { message } = req.body;
      console.log("Received message:", message);
  

        // Get BM25 results
        const bm25Results = bm25Manager.search(message);
    console.log("BM25 results:", bm25Results);

        // Generate embedding
        const embedding = await embeddings.embedQuery(message);

        // Prepare Pinecone query
        const queryRequest = {
            vector: embedding,
            topK: 5,
            includeMetadata: true,
            namespace: namespace === 'hybrid_namespace' ? 'hybrid_namespace_ayurved' : namespace
        };

        // Query Pinecone
        const index = pinecone.Index(process.env.PINECONE_INDEX);
        const queryResult = await index.query(queryRequest);
        console.log("Pinecone query result:", queryResult);

        // Combine results
        let reply = "I apologize, I don't have enough information to answer that question.";
        
        if (queryResult.matches?.length > 0 || bm25Results.length > 0) {
            // Combine or select between vector and BM25 results
            const vectorScore = queryResult.matches?.[0]?.score || 0;
            const bm25Score = bm25Results?.[0]?.score || 0;

            // Use whichever result has the higher score
            if (vectorScore > bm25Score && queryResult.matches?.[0]?.metadata?.reply) {
                reply = queryResult.matches[0].metadata.reply;
            } else if (bm25Results.length > 0 && bm25Results[0].metadata?.reply) {
                reply = bm25Results[0].metadata.reply;
            }
        }

        res.status(200).json({ response: "This is a BM25-based reply." });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ message: "An error occurred while processing your request" });
  }
};

module.exports = { handleChat };