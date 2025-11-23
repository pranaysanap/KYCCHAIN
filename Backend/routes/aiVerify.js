import express from "express";
import multer from "multer";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Configure Multer for temporary file storage
const upload = multer({ dest: "temp_uploads/" });

// Initialize Gemini API
const getGeminiModel = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing in .env");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

// Helper to convert file to GenerativePart
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: fs.readFileSync(path).toString("base64"),
            mimeType,
        },
    };
}

router.post("/verify-document", upload.single("document"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No document uploaded" });
        }

        const { documentType } = req.body;
        const filePath = req.file.path;
        const mimeType = req.file.mimetype;

        console.log(`🤖 AI Verification Request for: ${documentType}`);

        try {
            const model = getGeminiModel();

            const prompt = `
        Analyze this image carefully. 
        I am expecting a document of type: "${documentType}".
        
        Please verify if this image is indeed a valid "${documentType}".
        NOTE: For testing purposes, please ACCEPT "Specimen" or "Sample" documents as VALID.
        
        Return ONLY a JSON object with this structure (no markdown, no backticks):
        {
          "isValid": boolean,
          "confidence": number (0.0 to 1.0),
          "message": "Short explanation of why it is valid or invalid"
        }
      `;

            const imagePart = fileToGenerativePart(filePath, mimeType);
            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();

            console.log("🤖 Gemini Response:", text);

            // Parse JSON from response (handle potential markdown code blocks)
            const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const verificationResult = JSON.parse(jsonString);

            // Clean up temp file
            fs.unlinkSync(filePath);

            res.json(verificationResult);

        } catch (aiError) {
            console.error("❌ Gemini API Error:", aiError);

            // Clean up temp file
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

            if (aiError.message.includes("GEMINI_API_KEY")) {
                return res.status(500).json({
                    error: "Server configuration error: Gemini API Key missing",
                    isValid: false
                });
            }

            res.status(500).json({ error: "AI Verification failed", details: aiError.message });
        }

    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
