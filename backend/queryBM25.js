// queryBM25.js
const bm25Encoder = require("./bm25Encoder");

function queryBM25(query) {
  // Preprocess the query if needed
  const results = bm25Encoder.search(query);
  return results;
}

// Example usage:
console.log(queryBM25("skin infection"));
