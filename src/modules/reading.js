
export function renderReading() {
    return `
        <section class="reading-section">

            <h2>Reading 📖</h2>

            <p>
                Explore interesting topics and improve your
                English reading skills.
            </p>

            <div class="reading-search">

                <input
                    type="text"
                    id="reading-topic"
                    placeholder="What would you like to read about?"
                >

                <button id="search-reading">
                    Search
                </button>

            </div>

            <div id="reading-results"></div>

        </section>
    `;
}

// Evitar que el contenido externo se interprete como HTML
function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function safeWikipediaURL(url) {
    try {
        const parsedURL = new URL(url);

        if (
            parsedURL.protocol === "https:" &&
            parsedURL.hostname === "en.wikipedia.org"
        ) {
            return escapeHTML(parsedURL.href);
        }

    } catch (error) {
        console.error("Invalid article URL:", error);
    }

    return "#";
}

// Mostrar los temas encontrados
export function renderReadingTopics(topics) {

    return `
        <section class="reading-topics">
            <h3>Related readings</h3>

            <div class="reading-topics-grid">
                ${topics.map(topic => `
                    <article class="reading-topic-card">

                        <h4>${escapeHTML(topic.title)}</h4>

                        <p>${escapeHTML(topic.description)}</p>

                        <button
                            
                            class="reading-topic-button"
                            data-topic="${escapeHTML(topic.title)}"
                        >
                            Read in English Lab →
                        </button>
                    </article>
                `).join("")}
            </div>
        </section>
    `;
}