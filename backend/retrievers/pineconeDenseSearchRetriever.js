class PineconeDenseSearchRetriever {
  constructor(options) {
    this.embeddings = options.embeddings;
    this.top_k = options.top_k || 3;
    this.index = options.index;
    this.namespaces = ['namespace', 'namespace_ayurved'];
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }

  // Helper function to adjust vector dimensions
  adjustVectorDimension(vector, targetDim = 384) {
    if (vector.length === targetDim) return vector;
    if (vector.length > targetDim) return vector.slice(0, targetDim);
    return [...vector, ...new Array(targetDim - vector.length).fill(0)];
  }

  async retryQuery(namespace, queryEmbedding, attempt = 1) {
    try {
      console.log(`\n Attempt ${attempt} - Querying namespace: ${namespace}`);
      console.log("Query vector dimension:", queryEmbedding.length);
      
      const adjustedVector = this.adjustVectorDimension(queryEmbedding);
      console.log("Adjusted vector dimension:", adjustedVector.length);

      const response = await this.index.query({
        vector: adjustedVector,
        topK: this.top_k,
        includeMetadata: true,
        filter: {
          namespace: namespace
        }
      });

      if (!response.matches || response.matches.length === 0) {
        console.log(`No matches found in namespace: ${namespace}`);
      } else {
        console.log(`Found ${response.matches.length} matches in ${namespace}:`);
        response.matches.forEach((match, i) => {
          console.log(`Match ${i + 1}:`);
          console.log(`Score: ${match.score}`);
          console.log(`Text: ${match.metadata?.text || 'No text'}`);
        });
      }

      return response;

    } catch (error) {
      console.error(`\n Error querying ${namespace}:`, error);
      if (attempt < this.maxRetries) {
        console.log(`\n Retrying in ${this.retryDelay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retryQuery(namespace, queryEmbedding, attempt + 1);
      }
      return { matches: [] };
    }
  }

  async invoke(query) {
    try {
      console.log('\n=================================');
      console.log(` Starting Dense Search`);
      console.log(`Query: "${query}"`);

      const queryEmbedding = await this.embeddings.embedQuery(query);
      console.log("Generated embedding dimension:", queryEmbedding.length);
      
      const searchResults = await Promise.all(
        this.namespaces.map(namespace => 
          this.retryQuery(namespace, queryEmbedding)
        )
      );

      const allMatches = searchResults.flatMap((response, index) => {
        const matches = response.matches || [];
        console.log(`\nProcessing ${matches.length} matches from ${this.namespaces[index]}`);
        return matches.map(match => ({
          page_content: match.metadata?.text || '',
          score: match.score,
          namespace: this.namespaces[index]
        }));
      });

      const sortedMatches = allMatches.sort((a, b) => b.score - a.score);
      const finalResults = sortedMatches.slice(0, this.top_k);

      console.log('\n=================================');
      console.log(' Final Results Summary');
      console.log(`Total matches found: ${finalResults.length}`);
      finalResults.forEach((result, i) => {
        console.log(`\nResult ${i + 1}:`);
        console.log(`Namespace: ${result.namespace}`);
        console.log(`Score: ${result.score}`);
        console.log(`Content: ${result.page_content.substring(0, 100)}...`);
      });
      
      return finalResults;

    } catch (error) {
      console.error('\nFatal Error in Search:', error);
      throw error;
    }
  }
}

module.exports = PineconeDenseSearchRetriever;