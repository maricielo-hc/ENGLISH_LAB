
const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en";

// Buscar una palabra en el diccionario
export async function searchWord(word) {

    const cleanWord = word.trim().toLowerCase();

    if (!cleanWord) {
        throw new Error("Please enter a word.");
    }

    const response = await fetch(
        `${DICTIONARY_API}/${encodeURIComponent(cleanWord)}`
    );

    if (response.status === 404) {
        throw new Error("Word not found. Try another word.");
    }

    if (!response.ok) {
        throw new Error("Could not connect to the dictionary.");
    }

    const data = await response.json();

    return data[0];
}
