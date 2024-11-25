# 🎌 AnimeMetaForge

A powerful web application built with Next.js that helps you gather and combine anime metadata from various sources into a single, customized NFO file. Perfect for organizing your anime collection with rich metadata from trusted sources.

## Features

- Search anime across multiple databases
- Metadata aggregation from:
  - IMDB
  - The Movie Database (TMDB)
  - Fanart.tv
  - And more...
- Compare and select metadata from different sources
- Generate customized NFO files
- Preview metadata before saving
- Batch processing support
- Modern and responsive interface

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Various API integrations:
  - IMDB API
  - TMDB API
  - Fanart.tv API

## Getting Started

### Prerequisites

You'll need API keys for the following services:
- TMDB
- Fanart.tv
- IMDB

### Installation

1. Clone this repository
   ```bash
   git clone https://github.com/addreeh/nfo-generator-aph
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your API keys:
   ```env
   TMDB_API_KEY=your_tmdb_key
   FANART_API_KEY=your_fanart_key
   IMDB_API_KEY=your_imdb_key
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Usage

1. Search for an anime title
2. Select the correct match from search results
3. Wait for metadata to load from all sources
4. Compare and select desired information from each source
5. Customize NFO output format
6. Preview and download the generated NFO file

## API Integration Details

### TMDB
- Anime details
- Cast information
- Ratings
- Episode data

### Fanart.tv
- High quality artwork
- Posters
- Banners
- Background art

### IMDB
- Ratings
- Plot summaries
- Additional metadata

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Here are some ways you can contribute:
- Add support for additional metadata sources
- Improve metadata matching algorithms
- Add new NFO templates
- Enhance the user interface
- Fix bugs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all the API providers for making their services available
- Inspired by various media management tools in the community
