/**
 * AI Service for Document Verification
 * 
 * Calls the backend API which uses Google Gemini to analyze the document.
 */

const API_BASE_URL = "http://localhost:5000/api";

export interface VerificationResult {
    isValid: boolean;
    confidence: number;
    detectedType?: string;
    message?: string;
}

export const verifyDocumentWithAI = async (file: File, expectedType: string): Promise<VerificationResult> => {
    console.log(`🤖 AI Verification started for ${file.name} expecting ${expectedType}`);

    const formData = new FormData();
    formData.append("document", file);
    formData.append("documentType", expectedType);

    try {
        const response = await fetch(`${API_BASE_URL}/ai/verify-document`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Verification failed");
        }

        return {
            isValid: data.isValid,
            confidence: data.confidence,
            message: data.message,
        };

    } catch (error) {
        console.error("AI Verification Error:", error);
        // Fallback error message
        return {
            isValid: false,
            confidence: 0,
            message: error instanceof Error ? error.message : "Verification service unavailable",
        };
    }
};
