// backend/utils/bm25EncoderNew.js

/**
 * Dummy BM25 encoder for normal medicine retrieval.
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
      return [{ page_content: `BM25 normal result for "${query}"` }];
    },
  };
  