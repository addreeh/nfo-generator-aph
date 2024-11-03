import { CompleteShowData, TVMazeEpisode, TVMazeSeason } from '@/types/tvmaze'
import { NextResponse } from 'next/server'

const TVMAZE_BASE_URL = 'https://api.tvmaze.com'

async function lookupShowId (imdbId: string | null, tvdbId: string | null): Promise<number | null> {
  try {
    let response

    if (imdbId) {
      response = await fetch(`${TVMAZE_BASE_URL}/lookup/shows?imdb=${imdbId}`)
      if (response.ok) {
        const data = await response.json()
        return data.id
      }
    }

    if (tvdbId) {
      response = await fetch(`${TVMAZE_BASE_URL}/lookup/shows?thetvdb=${tvdbId}`)
      if (response.ok) {
        const data = await response.json()
        return data.id
      }
    }

    return null
  } catch (error) {
    console.error('Error looking up show:', error)
    return null
  }
}

async function getCompleteShowDetails (showId: number): Promise<CompleteShowData | null> {
  try {
    // Hacer todas las peticiones en paralelo para mejor rendimiento
    const [
      showResponse,
      seasonsResponse,
      castResponse,
      imagesResponse,
      episodesResponse
    ] = await Promise.all([
      fetch(`${TVMAZE_BASE_URL}/shows/${showId}?embed=episodes`),
      fetch(`${TVMAZE_BASE_URL}/shows/${showId}/seasons`),
      fetch(`${TVMAZE_BASE_URL}/shows/${showId}/cast`),
      fetch(`${TVMAZE_BASE_URL}/shows/${showId}/images`),
      fetch(`${TVMAZE_BASE_URL}/shows/${showId}/episodes`)
    ])

    // Verificar si alguna petición falló
    if (!showResponse.ok || !seasonsResponse.ok || !castResponse.ok || !imagesResponse.ok || !episodesResponse.ok) {
      console.error('TVMaze Error:', {
        showStatus: showResponse.status,
        seasonsStatus: seasonsResponse.status,
        castStatus: castResponse.status,
        imagesStatus: imagesResponse.status,
        episodesStatus: episodesResponse.status
      })
      return null
    }

    // Obtener los datos de todas las respuestas
    const [show, seasons, cast, images, episodes] = await Promise.all([
      showResponse.json(),
      seasonsResponse.json(),
      castResponse.json(),
      imagesResponse.json(),
      episodesResponse.json()
    ])

    // Organizar episodios por temporada
    const episodesBySeason = episodes.reduce((acc: { [key: number]: TVMazeEpisode[] }, episode: TVMazeEpisode) => {
      if (!acc[episode.season]) {
        acc[episode.season] = []
      }
      acc[episode.season].push(episode)
      return acc
    }, {})

    // Añadir episodios a cada temporada
    const seasonsWithEpisodes = seasons.map((season: TVMazeSeason) => ({
      ...season,
      episodes: episodesBySeason[season.number] || []
    }))

    return {
      show,
      seasons: seasonsWithEpisodes,
      cast,
      images,
      episodes
    }
  } catch (error) {
    console.error('Error fetching complete show details:', error)
    return null
  }
}

export async function GET (request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const imdbId = searchParams.get('imdb')
    const tvdbId = searchParams.get('tvdb')

    if (!imdbId && !tvdbId) {
      return NextResponse.json(
        { error: 'Either IMDB ID or TVDB ID is required' },
        { status: 400 }
      )
    }

    const tvMazeId = await lookupShowId(imdbId, tvdbId)

    if (!tvMazeId) {
      return NextResponse.json({
        error: 'Show not found in TVMaze'
      }, { status: 404 })
    }

    const result = await getCompleteShowDetails(tvMazeId)

    if (!result) {
      return NextResponse.json({
        error: 'Failed to fetch show details'
      }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in TVMaze endpoint:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch data from TVMaze'
      },
      { status: 500 }
    )
  }
}
