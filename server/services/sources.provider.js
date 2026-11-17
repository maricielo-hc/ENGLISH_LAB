
const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";
const WIKIPEDIA_SUMMARY_API = "https://en.wikipedia.org/api/rest_v1/page/summary";

// Buscar contenido en Wikipedia
export async function searchReadingContent(topic) {

    // Construir la URL de búsqueda
    const searchUrl = new URL(WIKIPEDIA_API);

    searchUrl.search = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: topic,
        srlimit: "5",
        format: "json"
    });

    // Consultar los resultados
    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
        throw new Error("Could not search Wikipedia.");
    }

    const searchData = await searchResponse.json();

    const results = searchData.query.search;

    // Comprobar si encontramos resultados
    if (results.length === 0) {
        throw new Error("No results found for this topic.");
    }

    // Seleccionar el resultado más relevante
    const firstResult = results[0];

    // Obtener el resumen del artículo
    const articleUrl =
        `${WIKIPEDIA_SUMMARY_API}/${encodeURIComponent(firstResult.title)}`;

    const articleResponse = await fetch(articleUrl);

    if (!articleResponse.ok) {
        throw new Error("Could not retrieve the Wikipedia article.");
    }

    const articleData = await articleResponse.json();

    // Devolver el contenido original y su procedencia
    return {
        title: articleData.title,
        content: articleData.extract,
        source: "Wikipedia",
        url: articleData.content_urls.desktop.page
    };
}


// Limpiar entidades HTML de las descripciones
function decodeHTML(text) {

    const entities = {
        "&amp;": "&",
        "&quot;": '"',
        "&#039;": "'",
        "&lt;": "<",
        "&gt;": ">",
        "&nbsp;": " "
    };

    return text
        .replace(/<[^>]*>/g, "")
        .replace(/&(?:amp|quot|lt|gt|nbsp);|&#039;/g, entity => {
            return entities[entity] || entity;
        })
        .replace(/&#(\d+);/g, (_, code) => {
            return String.fromCodePoint(Number(code));
        })
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => {
            return String.fromCodePoint(parseInt(code, 16));
        });
}


// Buscar temas para recomendar al usuario
export async function searchReadingTopics(query) {

    // Construir la URL de búsqueda
    const searchUrl = new URL(WIKIPEDIA_API);

    searchUrl.search = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: query,
        srlimit: "8",
        format: "json"
    });

    // Consultar Wikipedia
    const response = await fetch(searchUrl);

    if (!response.ok) {
        throw new Error("Could not retrieve reading topics.");
    }

    const data = await response.json();

    const results = data.query.search;

    // Comprobar si existen resultados
    if (results.length === 0) {
        throw new Error("No reading topics found.");
    }

    // Devolver los temas encontrados
    return results.map(item => ({
        title: item.title,
        description: decodeHTML(item.snippet),
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`
    }));
}
