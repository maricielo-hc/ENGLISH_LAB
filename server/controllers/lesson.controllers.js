import { searchReadingContent, searchReadingTopics } from "../services/sources.provider.js";
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

        console.error("Lesson error:", error.message);

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