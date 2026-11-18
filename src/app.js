
import {
    requestLesson,
    requestReadingTopics,
    requestReadingQuestions
} from "./services/lesson.service.js";

import {
    renderReading,
    renderReadingTopics,
    renderReadingQuestions,
    evaluateReadingAnswers
} from "./modules/reading.js";

import {
    renderVocabulary,
    renderWordDetails
} from "./modules/vocabulary.js";

import { searchWord } from "./services/dictionary.service.js";

import { renderGrammar, renderLesson } from "./modules/grammar.js";

const app = document.getElementById("view");

// Secciones disponibles
const sections = {
    hoy: {
        title: "Welcome to English Lab! 🌱",
        description: "Your English learning journey starts here."
    },
    gramatica: {
        title: "Grammar",
        description: "Learn grammar rules and practice your English."
    },
    vocabulario: {
        title: "Vocabulary",
        description: "Discover new words and expand your vocabulary."
    },
    listening: {
        title: "Listening",
        description: "Train your ears and improve your listening skills."
    },
    lectura: {
        title: "Reading",
        description: "Read interesting texts and improve your comprehension."
    },
    writing: {
        title: "Writing",
        description: "Practice writing in English."
    },
    speaking: {
        title: "Speaking",
        description: "Improve your pronunciation and speaking skills."
    },
    examen: {
        title: "Exams",
        description: "Test what you have learned."
    },
    progreso: {
        title: "Your Progress",
        description: "Follow your learning journey."
    }
};

// Mostrar la sección seleccionada
function renderSection() {

    const sectionName = window.location.hash.substring(1) || "hoy";
   
    document.querySelectorAll("#tabs a").forEach(link => {
        const isActive =
            link.getAttribute("href") === `#${sectionName}`;
        link.classList.toggle("active", isActive);
    });

    if (sectionName === "lectura") {
        app.innerHTML = renderReading();

        
        const searchButton = document.getElementById("search-reading");
        const topicInput = document.getElementById("reading-topic");
        
        const results = document.getElementById("reading-results");

        async function loadReadingQuestions(article) {
            const quizContainer = document.createElement("div");
            quizContainer.id = "reading-quiz-container";
            quizContainer.textContent = "Generating questions...";
            
            document.getElementById("reading-quiz-container")?.remove();
            
            results.appendChild(quizContainer);

            try {
                const questionsData = await requestReadingQuestions(
                    article.title,       
                    article.content,
        
                    document.getElementById("nivel").value
                );

                quizContainer.innerHTML = renderReadingQuestions(              
                    questionsData.questions
    
                );

                const quizForm = quizContainer.querySelector("#reading-quiz-form");

                quizForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                        const formData = new FormData(quizForm);
                        const evaluation = evaluateReadingAnswers(
                            questionsData.questions,
                            formData
                        );
                        
                        quizForm.querySelector("#submit-reading-quiz").remove();

                        const feedback = quizContainer.querySelector("#reading-quiz-feedback");
                        feedback.innerHTML = `
                        
                            <div class="reading-score">
                                <h3>Your result 🎉</h3>

                                <p>
                                    You got ${evaluation.score}                         
                                    out of ${evaluation.total} correct answers.
                                </p>

                                <h2>${evaluation.percentage}%</h2>

                            </div>

                            <div class="reading-corrections">
                                <h3>Review your answers</h3>

                                ${evaluation.results.map((result, index) => `
            
                                    <article class="reading-correction">
                
                                        <h4>
                    
                                            ${index + 1}. ${result.question}
                                        
                                        </h4>

                                        <p>
                
                                            ${result.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
                                        </p>

                                        <p>
                                            ${result.explanation}
                                        </p>

                                        ${!result.isCorrect ? `
                                            <p>
                                                <strong>Correct answer:</strong>
                                                ${questionsData.questions[index].options[result.correctAnswer]}
                                            </p>
                                        ` : ""}
                                    </article>
                                `).join("")}
                            </div>
                        `;
   
                });


            } catch (error) {
    
                console.error("Reading questions error:", error);
    
                quizContainer.textContent =
                    "Could not generate questions. Please try again.";

            }
        }

        // Detectar clics en los botones de artículos relacionados
        results.addEventListener("click", async (event) => {

            const button = event.target.closest(".reading-topic-button");

            // Comprobar si se pulsó un botón de lectura
            if (!button) return;

            const selectedTopic = button.dataset.topic;
            const level = document.getElementById("nivel").value;

            button.disabled = true;
            button.textContent = "Loading...";

            try {
                // Solicitar el artículo seleccionado
                const data = await requestLesson(
                    level,
                    "reading",
                    selectedTopic
                );

                // Crear el artículo
                const article = document.createElement("article");
                article.className = "reading-card";

                const title = document.createElement("h3");
                title.textContent = data.content.title;

                const paragraph = document.createElement("p");
                paragraph.textContent = data.content.content;

                const source = document.createElement("div");
                source.className = "reading-source";

                const sourceText = document.createElement("span");
                sourceText.textContent = `Source: ${data.content.source}`;

                const link = document.createElement("a");
                link.href = data.content.url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = "Read original article";

                source.append(sourceText, link);
                article.append(title, paragraph, source);

                // Reemplazar el artículo principal
                const previousArticle = results.querySelector(".reading-card");

                if (previousArticle) {
                    previousArticle.replaceWith(article);
                } else {
                    results.prepend(article);
                }
                await loadReadingQuestions(data.content);
            } catch (error) {
                console.error("Could not load selected article:", error);
                alert("Could not load this article. Please try again.");
            } finally {
                button.disabled = false;
                button.textContent = "Read in English Lab →";
            }
        });
        async function searchReading() {

            const topic = topicInput.value.trim();
            const results = document.getElementById("reading-results");
            const level = document.getElementById("nivel").value;

            // Comprobar si se escribió un tema
            if (!topic) {
                results.textContent = "Please enter a topic.";
                return;
            }
            
            searchButton.disabled = true;
            searchButton.textContent = "Searching...";
            results.textContent = "Finding your reading...";
            
            try {
                // Solicitar el artículo al backend
                const data = await requestLesson(level, "reading", topic);

                // Crear la tarjeta del artículo
                const article = document.createElement("article");
                article.className = "reading-card";
                
                const title = document.createElement("h3");
                title.textContent = data.content.title;
                
                const paragraph = document.createElement("p");
                paragraph.textContent = data.content.content;

                const source = document.createElement("div");
                source.className = "reading-source";

                const sourceText = document.createElement("span");
                sourceText.textContent = `Source: ${data.content.source}`;
                
                const link = document.createElement("a");
                link.href = data.content.url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = "Read original article";
                
                source.append(sourceText, link);
                article.append(title, paragraph, source);

                // Mostrar el artículo
                results.replaceChildren(article);
                
                await loadReadingQuestions(data.content);
                try {
                    const topicsData = await requestReadingTopics(topic);
                    const topicsHTML = renderReadingTopics(topicsData.topics);
                    
                    results.insertAdjacentHTML("beforeend", topicsHTML);
                
                } catch (error) {
                    console.error("Could not load related readings:", error);
                    
                    const message = document.createElement("p");
                    message.textContent = "Could not load related readings.";
                    
                    results.appendChild(message);
                }
            
            } catch (error) {
                results.textContent = "Could not find reading content.";
                console.error(error);
            }
            
            finally {
                searchButton.disabled = false;
                searchButton.textContent = "Search";
            }
        }



        // Buscar al hacer clic
        searchButton.addEventListener("click", searchReading);

        // Buscar al presionar Enter
        topicInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                searchReading();
            }
        });
        return;
    }


    if (sectionName === "vocabulario") {
        
        app.innerHTML = renderVocabulary();


        const searchButton = document.getElementById("search-vocabulary");
        const wordInput = document.getElementById("vocabulary-word");
        const results = document.getElementById("vocabulary-results");

        async function searchVocabulary() {
       
            const word = wordInput.value.trim();
        
            if (!word) {

                results.textContent = "Please enter a word.";           
                return;
       
            }
       
            results.textContent = "Searching...";        
            try {
       
                const wordData = await searchWord(word);            
                results.innerHTML = renderWordDetails(wordData);
       
            } catch (error) {            
                results.textContent = error.message;
     
            }   
        }
    
        searchButton.addEventListener("click", searchVocabulary);   
        wordInput.addEventListener("keydown", (event) => {
        
            if (event.key === "Enter") {        
                searchVocabulary();        
            }    
        });
    
        return;

    }

    if (sectionName === "gramatica") {
        app.innerHTML = renderGrammar();
        
        // Detectar cuando se selecciona un tema
        document.querySelectorAll(".grammar-button").forEach(button => {
            button.addEventListener("click", () => {
                app.innerHTML = renderLesson(button.dataset.topic);
                
                document.getElementById("back-grammar")
                    .addEventListener("click", renderSection);
            });
        });
        return;
    }

    // Para las demás secciones
    const section = sections[sectionName] || sections.hoy;

    app.innerHTML = `
        <section class="welcome">
            <h2>${section.title}</h2>
            <p>${section.description}</p>

            <div class="welcome-card">
                <h3>Coming soon!</h3>
                <p>We are preparing this learning section.</p>
            </div>
        </section>
    `;
}

// Iniciar aplicación
function initApp() {
    console.log("English Lab is running!");

    window.addEventListener("hashchange", renderSection);

    renderSection();
}

initApp();
