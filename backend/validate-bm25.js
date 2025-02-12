const fs = require('fs');
const path = './data/bm25_values_new.json';

try {
  const raw = fs.readFileSync(path, 'utf8');
  console.log('First 100 chars:', raw.substring(0, 100));
  
  const parsed = JSON.parse(raw);
  console.log(' Valid JSON Structure');
  console.log('avgdl:', parsed.avgdl);
  console.log('n_docs:', parsed.n_docs);
  console.log('doc_freq.indices length:', parsed.doc_freq?.indices?.length);
} catch (err) {
  console.error('❌ Invalid JSON:', err.message);
}