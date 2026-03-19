# The Vanilla Dex

A responsive, high-performance Pokémon encyclopedia built with vanilla JavaScript, HTML, and CSS. No frameworks required!

## Features

- **Gallery View**: Display the first 151 Pokémon (Generation 1) with official artwork
- **Search & Filter**: Live search by name and filter by Pokémon type
- **Detailed View**: Modal with stats, abilities, and evolution chains
- **Favorites System**: Heart your favorite Pokémon (persists in localStorage)
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices
- **Performance**: Lazy loading, caching, and pagination

## Technical Stack

- **Frontend**: Vanilla JavaScript (ES6+ modules)
- **Styling**: Custom CSS with CSS Variables for theming
- **API**: PokéAPI (https://pokeapi.co/api/v2/)
- **State Management**: JavaScript objects and localStorage
- **Build Tool**: None (served with simple HTTP server)

## Project Structure

```
pokedex-project/
├── index.html          # Main HTML file
├── src/
│   ├── main.js         # App initialization and event handling
│   ├── api.js          # PokéAPI fetch functions with caching
│   └── styles.css      # Custom CSS with responsive design
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## Getting Started

1. **Clone or download** the project files
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm start
   ```
4. **Open your browser** and navigate to `http://localhost:3000`

## API Usage

The app uses the following PokéAPI endpoints:

- `/pokemon?limit=20&offset=0` - Get list of Pokémon
- `/pokemon/{id}` - Get detailed Pokémon data
- `/pokemon-species/{id}` - Get species data for evolution chains
- `/evolution-chain/{id}` - Get evolution chain data
- `/type` - Get all Pokémon types

All API calls are cached to improve performance and reduce network requests.

## Browser Support

- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+

## Performance Optimizations

- **Lazy Loading**: Images load only when needed
- **Caching**: API responses are cached in memory
- **Pagination**: Load Pokémon in chunks of 20
- **Event Delegation**: Single event listener for gallery clicks
- **Minimal DOM Updates**: Use DocumentFragment for batch updates

## Contributing

This is a vanilla JavaScript project with no build tools. Simply edit the files in the `src/` directory and refresh your browser to see changes.

## License

MIT License - feel free to use this code for your own projects!
