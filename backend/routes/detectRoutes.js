// backend/routes/detectRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const detectController = require('../controllers/detectController');


const upload = multer({ dest: 'uploads/' });


router.post('/', upload.single('image'), detectController.detectSkinCondition);


router.get('/', (req, res) => {
  res.json({ message: 'Detect endpoint is working (GET test).' });
});

module.exports = router;
