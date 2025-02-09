const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/chatbotController");

router.post("/chatbot", handleChat);

module.exports = router;


