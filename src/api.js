const BASE_URL = 'https://pokeapi.co/api/v2';

const cache = new Map();

async function cachedFetch(url) {
    if (cache.has(url)) {
        return cache.get(url);
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    cache.set(url, data);
    return data;
}

export async function getPokemonList(limit = 20, offset = 0) {
    const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
    const data = await cachedFetch(url);
    return data.results;
}

export async function getPokemonDetail(nameOrId) {
    const url = `${BASE_URL}/pokemon/${nameOrId}`;
    return await cachedFetch(url);
}

export async function getPokemonSpecies(nameOrId) {
    const url = `${BASE_URL}/pokemon-species/${nameOrId}`;
    return await cachedFetch(url);
}

export async function getEvolutionChain(url) {
    return await cachedFetch(url);
}

export async function getAllTypes() {
    const url = `${BASE_URL}/type`;
    const data = await cachedFetch(url);
    return data.results;
}

export async function getPokemonByType(type) {
    const url = `${BASE_URL}/type/${type}`;
    const data = await cachedFetch(url);
    return data.pokemon.map((p) => p.pokemon);
}
