
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const detectRoutes = require('./routes/detectRoutes');

const app = express();

// Allow multiple origins
const allowedOrigins = ['http://localhost:8080', 'http://192.168.1.34:8080'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use('/api/detect', detectRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
