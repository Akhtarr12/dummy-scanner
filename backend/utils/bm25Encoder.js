// backend/utils/bm25EncoderNew.js
module.exports = {
    /**
     * Dummy search method.
     * @param {string} query 
     * @returns {Array<Object>} Array of result objects.
     */
    search: (query) => {
      return [{ page_content: `BM25 normal result for "${query}"` }];
    },
  };
  

