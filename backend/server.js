
const express = require('express');
const cors = require('cors');
const DermaChatBot = require("./DermaChatBot");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');

//const rateLimit = require("express-rate-limit");
require('dotenv').config();
const app = express();
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
  },
  credentials: true, // Add this to allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(bodyParser.json());

const detectRoutes = require('./routes/detectRoutes');
const chatbotRoutes = require("./routes/chatbotRoutes");


const bot = new DermaChatBot(
  process.env.OPENAI_API_KEY,
  process.env.PINECONE_API_KEY,
  process.env.PINECONE_INDEX || "medicalchatbothybrid",
  process.env.PINECONE_NAMESPACE || "hybrid_namespace_ayurved",
  process.env.PINECONE_NAMESPACE_2 || "hybrid_namespace"
);
// Endpoint to start conversation.
app.get("/start", (req, res) => {
  res.json({ message: bot.startConvo() });
});

// Endpoint for chat.
app.post("/api/chatbot", async (req, res) => {
  const { message } = req.body;
  const response = await bot.checkpointCheck(message);
  res.json({ response });
});



app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use('/api/detect', detectRoutes);
app.use('/api/chatbot', chatbotRoutes);
process.setMaxListeners(20);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
