require('dotenv').config();
const https = require('https');

const options = {
  hostname: `controller.${process.env.PINECONE_ENVIRONMENT}.pinecone.io`,
  port: 443,
  path: '/actions/whoami',
  method: 'GET',
  headers: {
    'Api-Key': process.env.PINECONE_API_KEY
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);

  res.on('data', (d) => {
    console.log('Data:', d.toString());
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.end(); 