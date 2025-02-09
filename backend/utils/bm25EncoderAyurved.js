// backend/utils/bm25EncoderAyurved.js

/**
 * Dummy BM25 encoder for ayurvedic medicine retrieval.
 * In production, you would load precomputed BM25 data and implement a proper search.
 */
module.exports = {
    /**
     * Searches for relevant documents given a query.
     * @param {string} query - The user's query.
     * @returns {Array<Object>} An array of result objects with a page_content field.
     */
    search: (query) => {
      // For demonstration, return a dummy result.
      return [{ page_content: `BM25 ayurvedic result for "${query}"` }];
    },
  };
  