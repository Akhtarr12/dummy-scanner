// backend/validate-wink-bm25.js
const BM25Encoder = require('wink-bm25-text-search');
const fs = require('fs');
const path = require('path');

const modelPath = path.join(__dirname, 'data', 'bm25_values_new.json');

try {
  console.log(`🔍 Validating BM25 model at: ${modelPath}`);
  
  // 1. Read raw JSON
  const rawJSON = fs.readFileSync(modelPath, 'utf8');
  
  // 2. Initialize BM25 engine
  const engine = BM25Encoder();
  
  // 3. Test import
  engine.importJSON(rawJSON);
  
  // 4. Validate critical parameters
  console.log('✅ Validation Successful');
  console.log(`📚 Documents: ${engine.n_docs}`);
  console.log(`📏 Avg Doc Length: ${engine.avgdl.toFixed(2)}`);
  console.log(`🔡 Vocabulary Size: ${Object.keys(engine.corpusVocabulary).length}`);
  
  // 5. Spot-check first 3 terms
  const sampleTerms = Object.entries(engine.corpusVocabulary).slice(0, 3);
  console.log('🔎 Sample Terms:', sampleTerms);
} catch (error) {
  console.error('❌ Validation Failed:', error.message);
  process.exit(1);
}