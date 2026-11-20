

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



export function renderWordDetails(wordData) {

    const phonetic = wordData.phonetic ||
        wordData.phonetics?.find(item => item.text)?.text ||
        "Not available";

    const audio = wordData.phonetics?.find(
        item => item.audio && item.audio.trim() !== ""
    )?.audio;

    return `
        <article class="vocabulary-card">

            <div class="vocabulary-word-header">

                <div>
                    <h3>${wordData.word}</h3>
                    <span>${phonetic}</span>
                </div>

                ${audio ? `
                    <button
                        type="button"
                        class="play-pronunciation"
                        data-audio="${audio}"
                    >
                        🔊 Listen
                    </button>
                ` : ""}

            </div>

            <div class="vocabulary-meanings">

                ${wordData.meanings.map(meaning => `

                    <section class="vocabulary-meaning">

                        <h4>${meaning.partOfSpeech}</h4>

                        ${meaning.definitions.slice(0, 3).map((item, index) => `

                            <div class="vocabulary-definition">

                                <p>
                                    <strong>${index + 1}.</strong>
                                    ${item.definition}
                                </p>

                                ${item.example ? `
                                    <blockquote>
                                        "${item.example}"
                                    </blockquote>
                                ` : ""}

                            </div>

                        `).join("")}

                    </section>

                `).join("")}

            </div>

        </article>
    `;
}

