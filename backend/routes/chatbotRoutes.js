const express = require('express');
const rateLimit = require('express-rate-limit');
const { getChatbotReply } = require('../utils/chatbotEngine');

const router = express.Router();

const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });

router.post('/message', chatLimiter, async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }
    const result = await getChatbotReply(message);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
