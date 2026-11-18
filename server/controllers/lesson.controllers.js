import { searchReadingContent, searchReadingTopics } from "../services/sources.provider.js";
import { generateAIContent } from "../services/ai.provider.js";
export async function getLesson(req, res) {
    
    const { level, skill, topic } = req.query;

    // Comprobar que llegaron los parámetros
    if (!level || !skill || !topic) {
        return res.status(400).json({
            status: "error",
            message: "Level, skill and topic are required."
        });
    }

    try {
        // Obtener contenido de una fuente externa
        const content = await searchReadingContent(topic);
        
        // Responder con el contenido obtenido
        res.json({
            status: "success",
            level,
            skill,
            content
        });
    } catch (error) {

        console.error("Lesson error:", error);
        console.error("Connection cause:", error.cause);

        return res.status(500).json({
            status: "error",
            message: "Could not retrieve lesson content."
        })
    }
    
}

// Buscar temas relacionados para Reading
export async function getReadingTopics(req, res) {

    const { query } = req.query;

    if (!query) {
        return res.status(400).json({
            status: "error",
            message: "A search query is required."
        });
    }

    try {
        const topics = await searchReadingTopics(query);

        return res.json({
            status: "success",
            topics
        });

    } catch (error) {
        console.error("Reading topics error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Could not retrieve reading topics."
        });
    }
}


// Generar preguntas de comprensión para Reading
export async function generateReadingQuestions(req, res) {

    const { title, content, level } = req.body;

    // Validar los datos recibidos
    if (!title || !content || !level) {
        return res.status(400).json({
            status: "error",
            message: "Title, content and level are required."
        });
    }

    try {

        // Preparar las instrucciones para Gemini
        const prompt = `
            You are an English teacher.

            Create 5 reading comprehension questions
            based ONLY on the following article.

            Article title: ${title}
            English level: ${level}

            Article content:
            ${content.substring(0, 12000)}

            Requirements:
            - Write all questions in English.
            - Create 4 answer options for each question.
            - Only one option must be correct.
            - Include an explanation for each answer.
            - Adapt the vocabulary and difficulty to the level.
            - Do not invent information outside the article.

            Return ONLY valid JSON using this structure:

            {
                "questions": [
                    {
                        "question": "Question text",
                        "options": [
                            "Option A",
                            "Option B",
                            "Option C",
                            "Option D"
                        ],
                        "correctAnswer": 0,
                        "explanation": "Explanation of the answer"
                    }
                ]
            }

            correctAnswer must be the index of the correct option,
            starting at 0.
        `;

        // Solicitar las preguntas a Gemini
        const aiResponse = await generateAIContent(prompt);

        // Convertir la respuesta de texto a JSON
        const result = JSON.parse(aiResponse);

        // Comprobar que existan preguntas
        if (!Array.isArray(result.questions) ||
            result.questions.length === 0) {
            throw new Error("Invalid questions generated.");
        }

        return res.json({
            status: "success",
            questions: result.questions
        });

    } catch (error) {

        console.error("Reading questions error:", error);

        return res.status(500).json({
            status: "error",
            message: "Could not generate reading questions."
        });
    }
}



