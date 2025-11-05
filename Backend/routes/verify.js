import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey:"sk-proj-nIYpshTrJnuUAthDAHsVDj_UI5kR6QLEh_2PjBUke0h2_Cm4Qq2aqBLLj1ZBcA0Y5Cgby1WLn1T3BlbkFJSxwTAlvcFJ1P7Uq9I2I2qZ1qf8cgLQTbdCk2HFnJOLyXxlxUH9oXjCOrUfYu1ln6oltw-2VYkAokk"// must match .env
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
