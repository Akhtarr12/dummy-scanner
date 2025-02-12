const fs = require('fs');

class BM25EncoderManager2 {
  constructor(filePath) {
    this.filePath = filePath;
    this.encoder = null;
    this.vocabulary = null;
    this.idf = null;
  }

  loadEncoder() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      const parsedData = JSON.parse(data);
      this.vocabulary = parsedData.vocabulary;
      this.idf = parsedData.idf;
      console.log("BM25 data loaded successfully!");
    } catch (error) {
      console.error(`Error loading BM25 data from ${this.filePath}:`, error);
    }
  }

  encode(query) {
    if (!this.vocabulary || !this.idf) {
      throw new Error("BM25 encoder not initialized");
    }

    const tokens = query.toLowerCase().split(/\s+/);
    const indices = [];
    const values = [];

    tokens.forEach(token => {
      const index = this.vocabulary.indexOf(token);
      if (index !== -1) {
        indices.push(index);
        values.push(this.idf[index] || 1.0);
      }
    });

    return { indices, values };
  }

  search(query) {
    // Implement search logic if needed
  }
}

module.exports = BM25EncoderManager2;