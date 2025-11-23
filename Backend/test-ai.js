import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

async function testGemini() {
    console.log("🧪 Testing Gemini API Integration...");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes("YOUR_GEMINI_API_KEY")) {
        console.error("❌ Error: GEMINI_API_KEY is not set in .env file");
        return;
    }

    console.log("✅ API Key found");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Try specific version: gemini-2.0-flash
        try {
            console.log("🔄 Trying 'gemini-2.0-flash'...");
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent("Hello");
            console.log("✅ 'gemini-2.0-flash' worked!");
            return;
        } catch (e) {
            console.log("❌ 'gemini-2.0-flash' failed:", e.message);
        }

    } catch (error) {
        console.error("❌ Gemini Test Failed:", error.message);
    }
}

testGemini();
