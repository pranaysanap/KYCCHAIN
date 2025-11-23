# AI Document Verification Walkthrough

I have implemented **Real AI Document Verification** using Google Gemini.

## Changes Made

### 1. Backend Integration
- **New Route**: `POST /api/ai/verify-document` in `Backend/routes/aiVerify.js`.
- **Logic**: 
  - Receives the image file.
  - Sends it to **Google Gemini 1.5 Flash**.
  - Asks Gemini: "Is this a valid [documentType]?"
  - Returns the AI's verdict (Valid/Invalid) and a reason.

### 2. Frontend Integration
- **Updated Service**: `src/services/aiService.ts` now calls the real backend API instead of using mock logic.
- **UI**: The "Verify" button now triggers a real AI analysis.

## ⚠️ Important: API Key Required

For this to work, you must add your Gemini API Key.

1.  **Get a Key**: Go to [Google AI Studio](https://aistudio.google.com/) and create a free API key.
2.  **Update .env**:
    - Open `Backend/.env`.
    - Find the line: `GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE`.
    - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key.
3.  **Restart Backend**:
    - If the backend is running, stop it (Ctrl+C) and start it again (`node server.js`).

## How to Test

1.  **Start Servers**: Ensure both backend and frontend are running.
2.  **Upload a Document**:
    - Select "Passport" in the dropdown.
    - Upload a real passport image (or a sample from Google).
3.  **Verify**:
    - Click "Verify Document with AI".
    - The AI will analyze the image content.
    - **Success**: If it looks like a passport, you can proceed.
    - **Failure**: If you upload a picture of a cat or a car, the AI will reject it with a message like "This appears to be a cat, not a passport."
