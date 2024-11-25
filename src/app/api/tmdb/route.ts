import { NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export async function GET (request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  let id = searchParams.get('id')
  const language = searchParams.get('language') ?? 'es-ES'

  if (!query && !id) {
    return NextResponse.json({ error: 'Se requiere un término de búsqueda o ID' }, { status: 400 })
  }

  try {
    // Si tenemos una query, primero buscamos el ID de TMDB
    if (query) {
      const searchResponse = await fetch(
        `${BASE_URL}/search/tv?api_key=${TMDB_API_KEY as string}&language=${language}&query=${encodeURIComponent(query)}`
      )
      const searchData = await searchResponse.json()

      // Si no encontramos resultados con la query completa, intentamos con la primera palabra
      if (searchData.results.length === 0) {
        const firstWord = query.split(' ')[0]
        const fallbackSearchResponse = await fetch(
          `${BASE_URL}/search/tv?api_key=${TMDB_API_KEY as string}&language=${language}&query=${encodeURIComponent(firstWord)}`
        )
        const fallbackSearchData = await fallbackSearchResponse.json()

        if (fallbackSearchData.results.length === 0) {
          return NextResponse.json({ error: 'No se encontraron resultados' }, { status: 404 })
        }

        // Usar el ID del primer resultado de la búsqueda con la primera palabra
        id = fallbackSearchData.results[0].id.toString()
      } else {
        // Usar el ID del primer resultado de la búsqueda original
        id = searchData.results[0].id.toString()
      }
    }

    // Una vez que tenemos el ID, procedemos con la obtención de detalles
    if (id) {
      // 1. Obtener detalles básicos con información adicional
      const detailsResponse = await fetch(
        `${BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY as string}&language=${language}&append_to_response=credits,videos,external_ids,recommendations,similar,keywords,content_ratings`
      )
      const details = await detailsResponse.json()

      // 2. Obtener todas las imágenes disponibles
      const imagesResponse = await fetch(
        `${BASE_URL}/tv/${id}/images?api_key=${TMDB_API_KEY as string}&include_image_language=en,null,${language}`
      )
      const imagesData = await imagesResponse.json()

      // 3. Obtener lista de temporadas con sus episodios
      const seasons = await Promise.all(
        details.seasons.map(async (season: any) => {
          const seasonResponse = await fetch(
            `${BASE_URL}/tv/${id as string}/season/${season.season_number as string}?api_key=${TMDB_API_KEY as string}&language=${language}`
          )
          const seasonData = await seasonResponse.json()

          const seasonImagesResponse = await fetch(
            `${BASE_URL}/tv/${id as string}/season/${season.season_number as string}/images?api_key=${TMDB_API_KEY as string}`
          )
          const seasonImages = await seasonImagesResponse.json()

          return {
            ...seasonData,
            images: {
              posters: seasonImages.posters?.map((poster: any) => ({
                ...poster,
                urls: {
                  original: `${IMAGE_BASE_URL}/original${poster.file_path as string}`,
                  w500: `${IMAGE_BASE_URL}/w500${poster.file_path as string}`,
                  w780: `${IMAGE_BASE_URL}/w780${poster.file_path as string}`
                }
              }))
            },
            poster_path: seasonData.poster_path ? `${IMAGE_BASE_URL}/original${seasonData.poster_path as string}` : null
          }
        })
      )

      const formatImages = (images: any[]): any => {
        return images?.map(image => ({
          ...image,
          urls: {
            original: `${IMAGE_BASE_URL}/original${image.file_path as string}`,
            w500: `${IMAGE_BASE_URL}/w500${image.file_path as string}`,
            w780: `${IMAGE_BASE_URL}/w780${image.file_path as string}`,
            w342: `${IMAGE_BASE_URL}/w342${image.file_path as string}`
          }
        })) || []
      }

      // Crear respuesta formateada
      const formattedResponse = {
        ...details,
        seasons,
        images: {
          posters: formatImages(imagesData.posters).sort((a: any, b: any) => b.vote_average - a.vote_average),
          backdrops: formatImages(imagesData.backdrops).sort((a: any, b: any) => b.vote_average - a.vote_average),
          logos: formatImages(imagesData.logos)
        },
        backdrop_path: details.backdrop_path ? `${IMAGE_BASE_URL}/original${details.backdrop_path as string}` : null,
        poster_path: details.poster_path ? `${IMAGE_BASE_URL}/original${details.poster_path as string}` : null,
        videos: {
          ...details.videos,
          results: details.videos.results.map((video: any) => ({
            ...video,
            url: video.site === 'YouTube'
              ? `https://www.youtube.com/watch?v=${video.key as string}`
              : null
          }))
        },
        credits: {
          cast: details.credits.cast.map((person: any) => ({
            ...person,
            profile_path: person.profile_path
              ? `${IMAGE_BASE_URL}/w185${person.profile_path as string}`
              : null
          })),
          crew: details.credits.crew.map((person: any) => ({
            ...person,
            profile_path: person.profile_path
              ? `${IMAGE_BASE_URL}/w185${person.profile_path as string}`
              : null
          }))
        },
        recommendations: {
          ...details.recommendations,
          results: details.recommendations.results.map((show: any) => ({
            ...show,
            poster_path: show.poster_path
              ? `${IMAGE_BASE_URL}/w342${show.poster_path as string}`
              : null,
            backdrop_path: show.backdrop_path
              ? `${IMAGE_BASE_URL}/w780${show.backdrop_path as string}`
              : null
          }))
        },
        similar: {
          ...details.similar,
          results: details.similar.results.map((show: any) => ({
            ...show,
            poster_path: show.poster_path
              ? `${IMAGE_BASE_URL}/w342${show.poster_path as string}`
              : null,
            backdrop_path: show.backdrop_path
              ? `${IMAGE_BASE_URL}/w780${show.backdrop_path as string}`
              : null
          }))
        },
        formatted_runtime: details.episode_run_time[0]
          ? `${Math.floor(details.episode_run_time[0] / 60)}h ${details.episode_run_time[0] % 60}min`
          : 'N/A',
        formatted_date: new Date(details.first_air_date).toLocaleDateString(
          language.split('-')[0],
          { year: 'numeric', month: 'long', day: 'numeric' }
        ),
        year: new Date(details.first_air_date).getFullYear(),
        status_translated: translateStatus(details.status, language)
      }

      return NextResponse.json(formattedResponse)
    }
  } catch (error) {
    console.error('Error al obtener información de TMDB:', error)
    return NextResponse.json({ error: 'Error al obtener información del contenido' }, { status: 500 })
  }

  return NextResponse.json({ error: 'Error desconocido' }, { status: 500 })
}

function translateStatus (status: string, language: string): string {
  if (language.startsWith('es')) {
    const statusMap: { [key: string]: string } = {
      'Returning Series': 'En emisión',
      Ended: 'Finalizada',
      Canceled: 'Cancelada',
      Pilot: 'Piloto',
      'In Production': 'En producción',
      Planned: 'Planificada'
    }
    return statusMap[status] || status
  }
  return status
}
