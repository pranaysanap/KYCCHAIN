# Implementation Plan - Gemini AI Verification

## Goal
Replace the mock AI verification with real image analysis using Google's Gemini 1.5 Flash model. This will allow the system to actually check if an uploaded document matches the selected type (Passport, ID Card, etc.).

## User Review Required
> [!IMPORTANT]
> You will need a **Google Gemini API Key**. You can get one for free at [aistudio.google.com](https://aistudio.google.com/).
> I will add a placeholder in your `.env` file: `GEMINI_API_KEY=YOUR_KEY_HERE`.

## Proposed Changes

### Backend
#### [NEW] [Backend/routes/aiVerify.js](file:///e:/sai/KYCCHAIN-main/KYCCHAIN-main/Backend/routes/aiVerify.js)
- Create a new route `POST /verify-document`.
- Use `multer` to handle the file upload (in memory or temp file).
- Use `@google/generative-ai` to send the image to Gemini.
- Prompt: "Analyze this image. Is it a valid [documentType]? Return JSON."

#### [MODIFY] [Backend/server.js](file:///e:/sai/KYCCHAIN-main/KYCCHAIN-main/Backend/server.js)
- Register the new route: `app.use("/api/ai", aiVerifyRoutes);`

#### [MODIFY] [Backend/package.json](file:///e:/sai/KYCCHAIN-main/KYCCHAIN-main/Backend/package.json)
- Add `@google/generative-ai` dependency.

### Frontend
#### [MODIFY] [src/services/aiService.ts](file:///e:/sai/KYCCHAIN-main/KYCCHAIN-main/src/services/aiService.ts)
- Update `verifyDocumentWithAI` to call the real backend endpoint `http://localhost:5000/api/ai/verify-document`.
- Handle `FormData` submission.

## Verification Plan
### Manual Verification
1. **Setup**: User adds their Gemini API Key to `Backend/.env`.
2. **Run**: Start backend (`node server.js`) and frontend (`npm run dev`).
3. **Test Valid**: Upload a real ID card image -> Expect "Success".
4. **Test Invalid**: Upload a random image (e.g., a cat) -> Expect "Put valid doc".
