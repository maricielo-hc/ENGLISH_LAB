

import { searchWord } from "../services/dictionary.service.js";
export function renderVocabulary() {
    return `
        <section class="vocabulary-section">

            <h2>Vocabulary 📚</h2>

            <p>
                Discover new words, explore their meanings
                and expand your English vocabulary.
            </p>

            <div class="vocabulary-search">

                <input
                    type="text"
                    id="vocabulary-word"
                    placeholder="Enter an English word..."
                >

                <button id="search-vocabulary">
                    Search
                </button>

            </div>

            <div id="vocabulary-results"></div>

        </section>
    `;
}


// Mostrar la información de una palabra
export function renderWordDetails(wordData) {

    const meaning = wordData.meanings?.[0];
    const definition = meaning?.definitions?.[0];

    const phonetic = wordData.phonetic ||
        wordData.phonetics?.find(item => item.text)?.text ||
        "Not available";

    return `
        <article class="vocabulary-card">

            <div class="vocabulary-word-header">

                <h3>${wordData.word}</h3>

                <span>${phonetic}</span>

            </div>

            <div class="vocabulary-meaning">

                <span class="vocabulary-type">
                    ${meaning?.partOfSpeech || "Meaning"}
                </span>

                <p>
                    ${definition?.definition || "No definition available."}
                </p>

                ${definition?.example ? `
                    <blockquote>
                        "${definition.example}"
                    </blockquote>
                ` : ""}

            </div>

        </article>
    `;
}


