import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/verify-doc", async (req, res) => {
  try {
    const { documentText } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "user", content: `Analyze this KYC document: ${documentText}` }
      ]
    });
    res.json({ ai_verdict: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI verification failed" });
  }
});

export default router;
