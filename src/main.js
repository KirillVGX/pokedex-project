import {
    getPokemonList,
    getPokemonDetail,
    getPokemonSpecies,
    getEvolutionChain,
    getAllTypes,
} from './api.js';
import {
    createPokemonCard,
    showModal,
    hideModal,
    showLoading,
    hideLoading,
    updateGallery,
    clearGallery,
    toggleLoadMoreButton,
    populateTypeFilter,
    toggleTheme,
    loadTheme,
    createPokemonDetail,
} from './ui.js';

// State management
let allPokemon = [];
let filteredPokemon = [];
let currentOffset = 0;
const limit = 20;
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let currentFilter = { search: '', type: '' };

// DOM elements
const searchInput = document.getElementById('search');
const typeFilter = document.getElementById('type-filter');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
const themeToggle = document.getElementById('theme-toggle');
const loadMoreBtn = document.getElementById('load-more-btn');

// Initialize app
async function init() {
    loadTheme();
    setupEventListeners();
    await loadTypes();
    await loadInitialPokemon();
}

// Setup event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    typeFilter.addEventListener('change', handleTypeFilter);

    closeBtn.addEventListener('click', hideModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    gallery.addEventListener('click', handleGalleryClick);
    themeToggle.addEventListener('click', toggleTheme);
    loadMoreBtn.addEventListener('click', loadMorePokemon);
}

async function loadTypes() {
    try {
        const types = await getAllTypes();
        populateTypeFilter(types);
    } catch (error) {
        console.error('Error loading types:', error);
    }
}

async function loadInitialPokemon() {
    showLoading();
    try {
        const pokemonList = await getPokemonList(limit, currentOffset);
        const pokemonDetails = await Promise.all(
            pokemonList.map((pokemon) => getPokemonDetail(pokemon.name))
        );

        allPokemon = pokemonDetails;
        filteredPokemon = [...allPokemon];
        renderGallery();
        currentOffset += limit;
        toggleLoadMoreButton(true);
    } catch (error) {
        console.error('Error loading Pokémon:', error);
    } finally {
        hideLoading();
    }
}

async function loadMorePokemon() {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';

    try {
        const pokemonList = await getPokemonList(limit, currentOffset);
        const pokemonDetails = await Promise.all(
            pokemonList.map((pokemon) => getPokemonDetail(pokemon.name))
        );

        allPokemon.push(...pokemonDetails);
        applyFilters();
        currentOffset += limit;
    } catch (error) {
        console.error('Error loading more Pokémon:', error);
    } finally {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More';
    }
}

function renderGallery() {
    clearGallery();
    const fragment = document.createDocumentFragment();

    filteredPokemon.forEach((pokemon) => {
        const isFavorite = favorites.includes(pokemon.id);
        const card = createPokemonCard(pokemon, isFavorite);
        fragment.appendChild(card);
    });

    updateGallery(fragment);
}

function handleSearch(e) {
    currentFilter.search = e.target.value.toLowerCase();
    applyFilters();
}

function handleTypeFilter(e) {
    currentFilter.type = e.target.value;
    applyFilters();
}

function applyFilters() {
    filteredPokemon = allPokemon.filter((pokemon) => {
        const matchesSearch = pokemon.name
            .toLowerCase()
            .includes(currentFilter.search);
        const matchesType =
            !currentFilter.type ||
            pokemon.types.some((type) => type.type.name === currentFilter.type);
        return matchesSearch && matchesType;
    });

    renderGallery();
}

async function handleGalleryClick(e) {
    const card = e.target.closest('.pokemon-card');
    if (!card) return;

    const pokemonId = parseInt(card.dataset.id);
    const pokemon = allPokemon.find((p) => p.id === pokemonId);

    if (!pokemon) return;

    if (
        e.target.classList.contains('favorite-btn') ||
        e.target.closest('.favorite-btn')
    ) {
        const btn = e.target.classList.contains('favorite-btn')
            ? e.target
            : e.target.closest('.favorite-btn');
        const pokemonId = parseInt(btn.dataset.id);
        toggleFavorite(pokemonId);
        return;
    }

    try {
        const [species, evolutionData] = await Promise.all([
            getPokemonSpecies(pokemon.id),
            getEvolutionChainData(pokemon.id),
        ]);

        const modalContent = createPokemonDetail(
            pokemon,
            species,
            evolutionData
        );
        showModal(modalContent);
    } catch (error) {
        console.error('Error loading Pokémon details:', error);
        const modalContent = createPokemonDetail(pokemon, null, null);
        showModal(modalContent);
    }
}

async function getEvolutionChainData(pokemonId) {
    try {
        const species = await getPokemonSpecies(pokemonId);
        if (species.evolution_chain) {
            return await getEvolutionChain(species.evolution_chain.url);
        }
    } catch (error) {
        console.error('Error loading evolution chain:', error);
    }
    return null;
}

function toggleFavorite(pokemonId) {
    const index = favorites.indexOf(pokemonId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(pokemonId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderGallery();
}

init();
