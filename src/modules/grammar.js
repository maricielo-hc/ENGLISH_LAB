
const grammarTopics = [
    {
        id: 1,
        title: "Present Simple",
        level: "A2",
        description: "Talk about habits and daily routines.",
        examples: [
            "I study English every day.",
            "She works at a university.",
            "They don't like coffee."
        ]
    },
    {
        id: 2,
        title: "Present Continuous",
        level: "A2",
        description: "Describe actions happening now.",
        examples: [
            "I am studying English.",
            "She is reading a book.",
            "They are playing football."
        ]
    },
    {
        id: 3,
        title: "Past Simple",
        level: "A2",
        description: "Talk about completed actions in the past.",
        examples: [
            "I visited my grandmother yesterday.",
            "He watched a movie.",
            "We didn't go to school."
        ]
    }
];

// Mostrar los temas de gramática
export function renderGrammar() {
    return `
        <section class="grammar-section">
            <h2>Grammar 📚</h2>
            <p>Choose a topic and start learning.</p>

            <div class="grammar-grid">
                ${grammarTopics.map(topic => `
                    <article class="grammar-card">
                        <span class="grammar-level">${topic.level}</span>

                        <h3>${topic.title}</h3>
                        <p>${topic.description}</p>

                        <button 
                            class="grammar-button"
                            data-topic="${topic.id}">
                            Start lesson →
                        </button>
                    </article>
                `).join("")}
            </div>
        </section>
    `;
}


export function renderLesson(topicId) {

    const topic = grammarTopics.find(
        item => item.id === Number(topicId)
    );

    if (!topic) {
        return "<p>Lesson not found.</p>";
    }

    return `
        <section class="grammar-section">

            <button class="back-button" id="back-grammar">
                ← Back to Grammar
            </button>

            <h2>${topic.title}</h2>

            <span class="grammar-level">${topic.level}</span>

            <p>${topic.description}</p>

            <div class="grammar-card">
                <h3>Examples</h3>

                <ul>
                    ${topic.examples.map(example => `
                        <li>${example}</li>
                    `).join("")}
                </ul>
            </div>

        </section>
    `;
}
