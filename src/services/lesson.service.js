
const API_URL = "http://localhost:3000/api";

// Solicitar una lección al backend
export async function requestLesson(level, skill, topic) {

    const params = new URLSearchParams({
        level,
        skill,
        topic
    });

    const response = await fetch(
        `${API_URL}/lessons?${params}`
    );

    if (!response.ok) {
        throw new Error("Could not request the lesson.");
    }

    const data = await response.json();

    return data;
}

// Buscar temas relacionados para Reading
export async function requestReadingTopics(query) {

    const params = new URLSearchParams({
        query
    });

    const response = await fetch(
        `${API_URL}/lessons/topics?${params}`
    );

    if (!response.ok) {
        throw new Error("Could not request reading topics.");
    }

    const data = await response.json();

    return data;
}