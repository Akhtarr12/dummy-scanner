// backend/controllers/detectController.js
const axios = require('axios');
const fs = require('fs');

exports.detectSkinCondition = async (req, res) => {
  try {
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log('File received:', req.file);
    
    const imagePath = req.file.path;
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath), req.file.originalname);
    
    // Call AWS detection API
    const awsResponse = await axios.post('http://51.20.53.39:5000/detect', form, {
      headers: form.getHeaders()
    });
    
    // Remove the temporary file after processing
    fs.unlinkSync(imagePath);
    
    console.log('AWS response:', awsResponse.data);
    
    res.json(awsResponse.data);
  } catch (error) {
    console.error('Detection error:', error.message);
    res.status(500).json({ error: 'Detection failed', details: error.message });
  }
};


