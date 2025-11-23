import dotenv from 'dotenv';

// Load env vars
dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ Error: GEMINI_API_KEY is not set");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        console.log("Fetching available models...");
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ Error listing models:", data.error);
            return;
        }

        if (!data.models) {
            console.log("⚠️ No models found in response:", data);
            return;
        }

        console.log("\n✅ Available Models:");
        data.models.forEach(model => {
            if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${model.name.replace("models/", "")} (${model.displayName})`);
            }
        });

    } catch (error) {
        console.error("❌ Network error:", error.message);
    }
}

listModels();
