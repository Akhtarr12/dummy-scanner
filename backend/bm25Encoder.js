const winkBM25 = require('wink-bm25-text-search');
const fs = require('fs');
const path = require('path');

// Initialize BM25 encoder
const bm25Encoder = winkBM25();

// Configure BM25
bm25Encoder.defineConfig({ fldWeights: { text: 1, title: 2 } });

// Load your training data (example format)
const trainingData = [
    { text: "Skin infection is a bacterial infection that affects the skin", reply: "A skin infection is a condition where bacteria invade the skin, causing inflammation and other symptoms." },
    { text: "Common symptoms of skin infection include redness, swelling, and pain", reply: "Common signs of skin infection are redness, swelling, warmth, pain, and sometimes pus." },
    // Add more training examples here
];

// Prepare documents
trainingData.forEach((doc, idx) => {
    bm25Encoder.addDoc({
        id: idx,
        text: doc.text,
        reply: doc.reply
    });
});

// Build the search index
bm25Encoder.consolidate();

module.exports = {
    bm25Encoder,
    trainingData
};
