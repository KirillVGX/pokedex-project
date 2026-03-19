// API functions for PokéAPI
const BASE_URL = "https://pokeapi.co/api/v2";

// Cache for API responses
const cache = new Map();

// Generic fetch with caching
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

// Get list of Pokémon
export async function getPokemonList(limit = 20, offset = 0) {
  const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  const data = await cachedFetch(url);
  return data.results;
}

// Get detailed Pokémon data
export async function getPokemonDetail(nameOrId) {
  const url = `${BASE_URL}/pokemon/${nameOrId}`;
  return await cachedFetch(url);
}

// Get Pokémon species data (for evolution chain)
export async function getPokemonSpecies(nameOrId) {
  const url = `${BASE_URL}/pokemon-species/${nameOrId}`;
  return await cachedFetch(url);
}

// Get evolution chain
export async function getEvolutionChain(url) {
  return await cachedFetch(url);
}

// Get all types for filter dropdown
export async function getAllTypes() {
  const url = `${BASE_URL}/type`;
  const data = await cachedFetch(url);
  return data.results;
}

// Get Pokémon by type
export async function getPokemonByType(type) {
  const url = `${BASE_URL}/type/${type}`;
  const data = await cachedFetch(url);
  return data.pokemon.map((p) => p.pokemon);
}
