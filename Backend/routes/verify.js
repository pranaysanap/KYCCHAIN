import express from "express";
// import OpenAI from "openai";

const router = express.Router();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

router.post("/verify-doc", async (req, res) => {
  try {
    const { documentText } = req.body;
    // Mock AI response for now
    const ai_verdict = `Mock AI analysis: Document appears valid. Length: ${documentText.length} characters.`;
    res.json({ ai_verdict });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI verification failed" });
  }
});

export default router;
