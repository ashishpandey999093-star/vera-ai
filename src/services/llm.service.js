 import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const generateWithGemini = async (prompt) => {

    for (let attempt = 1; attempt <= 3; attempt++) {

        try {

            const response = await ai.models.generateContent({
                model: "gemini-3.1-flash-lite",
                contents: prompt,
                config: {
                    responseMimeType: "application/json"
                }
            });

            return JSON.parse(response.text);

        } catch (error) {

            console.error(
                `Gemini attempt ${attempt} failed:`,
                error?.message || error
            );

            const message = error?.message || "";

            const temporaryFailure =
                message.includes("503") ||
                message.includes("UNAVAILABLE") ||
                message.includes("high demand");

            // If it is not a temporary Gemini availability error,
            // don't retry it.
            if (!temporaryFailure || attempt === 3) {

                return {
                    should_act: false,
                    reason: "Gemini temporarily unavailable"
                };
            }

            await sleep(attempt * 1500);
        }
    }
};