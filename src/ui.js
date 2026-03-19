const typeColors = {
    fire: '#ff6b35',
    water: '#4ecdc4',
    grass: '#45b7d1',
    electric: '#f9ca24',
    psychic: '#a55eea',
    ice: '#74b9ff',
    dragon: '#6c5ce7',
    dark: '#2d3436',
    fairy: '#fd79a8',
    normal: '#a4b0be',
    fighting: '#d63031',
    poison: '#a29bfe',
    ground: '#f0932b',
    flying: '#81ecec',
    bug: '#00b894',
    rock: '#fdcb6e',
    ghost: '#636e72',
    steel: '#95a5a6',
};

export function createPokemonCard(pokemon, isFavorite = false) {
    const card = document.createElement('div');
    card.className = `pokemon-card ${isFavorite ? 'favorite' : ''}`;
    card.dataset.id = pokemon.id;
    card.dataset.name = pokemon.name;

    const primaryType = pokemon.types[0].type.name;
    card.style.background = `linear-gradient(135deg, ${typeColors[primaryType] || '#a4b0be'}22, ${typeColors[primaryType] || '#a4b0be'}44)`;

    const capitalizedName =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    card.innerHTML = `
        <div class="card-header">
            <div class="card-meta">
                <span class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</span>
                <span class="pokemon-name">${capitalizedName}</span>
            </div>
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${pokemon.id}">
                ${isFavorite ? '❤️' : '🤍'}
            </button>
        </div>
        <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}"
             alt="${pokemon.name}" class="pokemon-image" loading="lazy">
        <div class="types">
            ${pokemon.types.map((type) => `<span class="type ${type.type.name}">${type.type.name}</span>`).join('')}
        </div>
    `;

    return card;
}

export function createLoadingSpinner() {
    return `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
}

export function createPokemonDetail(pokemon, species, evolutionChain) {
    const stats = pokemon.stats;
    const abilities = pokemon.abilities;

    return `
        <div class="detail-header">
            <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}"
                 alt="${pokemon.name}" class="detail-image">
            <div class="detail-info">
                <h2>${pokemon.name} #${String(pokemon.id).padStart(3, '0')}</h2>
                <div class="detail-types">
                    ${pokemon.types.map((type) => `<span class="type ${type.type.name}">${type.type.name}</span>`).join('')}
                </div>
            </div>
        </div>

        <div class="stats">
            <h3>Base Stats</h3>
            ${stats
                .map(
                    (stat) => `
                <div class="stat">
                    <strong>${stat.stat.name}: ${stat.base_stat}</strong>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${Math.min((stat.base_stat / 255) * 100, 100)}%"></div>
                    </div>
                </div>
            `
                )
                .join('')}
        </div>

        <div class="abilities">
            <h3>Abilities</h3>
            ${abilities.map((ability) => `<span class="ability">${ability.ability.name}</span>`).join('')}
        </div>

        ${evolutionChain ? createEvolutionSection(evolutionChain) : ''}
    `;
}

function createEvolutionSection(chain) {
    const evolutions = parseEvolutionChain(chain);

    if (evolutions.length <= 1) return '';

    return `
        <div class="evolution">
            <h3>Evolution Chain</h3>
            <div class="evolution-chain">
                ${evolutions
                    .map(
                        (evo, index) => `
                    <div class="evolution-item">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png"
                             alt="${evo.name}" loading="lazy">
                        <span>${evo.name}</span>
                        ${index < evolutions.length - 1 ? '<span class="arrow">→</span>' : ''}
                    </div>
                `
                    )
                    .join('')}
            </div>
        </div>
    `;
}

function parseEvolutionChain(chain) {
    const evolutions = [];
    let current = chain.chain;

    while (current) {
        evolutions.push({
            name: current.species.name,
            id: current.species.url.split('/').slice(-2, -1)[0],
        });
        current = current.evolves_to[0];
    }

    return evolutions;
}

export function showModal(content) {
    const modal = document.getElementById('modal');
    const detailContainer = document.getElementById('pokemon-detail');
    detailContainer.innerHTML = content;
    modal.style.display = 'block';
}

export function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

export function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

export function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

export function updateGallery(cards) {
    const gallery = document.getElementById('gallery');
    gallery.appendChild(cards);
}

export function clearGallery() {
    document.getElementById('gallery').innerHTML = '';
}

export function toggleLoadMoreButton(show) {
    document.getElementById('load-more').style.display = show
        ? 'block'
        : 'none';
}

export function populateTypeFilter(types) {
    const select = document.getElementById('type-filter');
    select.innerHTML = '<option value="">All Types</option>';

    types.forEach((type) => {
        const option = document.createElement('option');
        option.value = type.name;
        option.textContent =
            type.name.charAt(0).toUpperCase() + type.name.slice(1);
        select.appendChild(option);
    });
}

export function toggleTheme() {
    const body = document.body;
    const currentTheme = body.dataset.theme;
    const newTheme = currentTheme === 'dark' ? '' : 'dark';
    body.dataset.theme = newTheme;

    const toggleBtn = document.getElementById('theme-toggle');
    toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';

    localStorage.setItem('theme', newTheme);
}

export function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
        const toggleBtn = document.getElementById('theme-toggle');
        toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}
