
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
