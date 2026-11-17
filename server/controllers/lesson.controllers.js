
export function getLesson(req, res) {

    const { level, skill, topic } = req.query;

    // Comprobar que llegaron los parámetros
    if (!level || !skill || !topic) {
        return res.status(400).json({
            status: "error",
            message: "Level, skill and topic are required."
        });
    }

    // Responder con los parámetros recibidos
    res.json({
        status: "success",
        message: "Lesson request received!",
        request: {
            level,
            skill,
            topic
        }
    });
}
