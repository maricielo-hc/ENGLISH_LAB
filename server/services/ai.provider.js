
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Cargar las variables de entorno
dotenv.config();

// Comprobar que exista la API key
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
}

// Crear el cliente de Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Función para generar contenido con IA

export async function generateAIContent(prompt) {

    // Número máximo de intentos
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        try {
            const response = await ai.models.generateContent({
                model: "gemini-3.8-flash",
                contents: prompt
            });

            return response.text;

        } catch (error) {

            console.error(`Gemini attempt ${attempt}:`, error);

            // Reintentar únicamente si el servicio está saturado
            if (error.status === 503 && attempt < maxAttempts) {

                const waitTime = attempt * 2000;

                console.log(
                    `Retrying in ${waitTime / 1000} seconds...`
                );

                await new Promise(resolve =>
                    setTimeout(resolve, waitTime)
                );

                continue;
            }

            if (error.status === 429) {
                throw new Error(
                    "Gemini usage limit reached. Please try again later."
                );
            }

            throw new Error("Could not generate AI content.");
        }
    }
}

