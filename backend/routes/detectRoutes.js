// backend/routes/detectRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const detectController = require('../controllers/detectController');

// Configure multer to store uploaded files temporarily in the 'uploads' folder
const upload = multer({ dest: 'uploads/' });

// Define a POST route at '/' which will be mounted at /api/detect
router.post('/', upload.single('image'), detectController.detectSkinCondition);

// Optional: Add a GET route for testing
router.get('/', (req, res) => {
  res.json({ message: 'Detect endpoint is working (GET test).' });
});

module.exports = router;
