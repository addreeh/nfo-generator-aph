import { Provider } from '@/types'
import { AniListAnime } from '@/types/anilist'
import { OMDBAnime } from '@/types/omdb'
import { TMDBAnime } from '@/types/tmdb'
import { TVDBAnime } from '@/types/tvdb'
import { TVMazeAnime } from '@/types/tvmaze'

// Definimos una unión de tipos para los datos de imagen
export type ImageData = AniListAnime | OMDBAnime | TMDBAnime | TVDBAnime | TVMazeAnime | null | undefined

// Funciones de type guard para verificar el tipo de datos
const isAniListAnime = (data: ImageData): data is AniListAnime => {
  return data !== null && data !== undefined && 'title' in data && 'coverImage' in data
}

const isOMDBAnime = (data: ImageData): data is OMDBAnime => {
  return data !== null && data !== undefined && 'Poster' in data && 'Title' in data
}

const isTMDBAnime = (data: ImageData): data is TMDBAnime => {
  return data !== null && data !== undefined && 'poster_path' in data && 'name' in data
}

const isTVDBAnime = (data: ImageData): data is TVDBAnime => {
  return data !== null && data !== undefined && 'image' in data && 'name' in data
}

const isTVMazeAnime = (data: ImageData): data is TVMazeAnime => {
  return data !== null && data !== undefined && 'show' in data && typeof data.show === 'object' &&
         data.show !== null && 'image' in data.show && 'name' in data.show
}

// Constante para la imagen placeholder
const PLACEHOLDER_IMAGE = '/images/placeholder.jpg' // Asegúrate de que esta ruta existe en tu proyecto

export const getImageSource = (provider: Provider, data: ImageData): string => {
  if (!data) return PLACEHOLDER_IMAGE

  switch (provider) {
    case 'anilist': {
      if (!isAniListAnime(data)) return PLACEHOLDER_IMAGE
      return data.coverImage?.extraLarge || data.coverImage?.medium || PLACEHOLDER_IMAGE
    }

    case 'omdb': {
      if (!isOMDBAnime(data)) return PLACEHOLDER_IMAGE
      return data.Poster !== 'N/A' ? data.Poster : PLACEHOLDER_IMAGE
    }

    case 'tmdb': {
      if (!isTMDBAnime(data)) return PLACEHOLDER_IMAGE
      const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
      return data.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}`
        : PLACEHOLDER_IMAGE
    }

    case 'tvdb': {
      if (!isTVDBAnime(data)) return PLACEHOLDER_IMAGE
      return data.image || PLACEHOLDER_IMAGE
    }

    case 'tvmaze': {
      if (!isTVMazeAnime(data)) return PLACEHOLDER_IMAGE
      return data.show.image?.original ?? PLACEHOLDER_IMAGE
    }

    default:
      return PLACEHOLDER_IMAGE
  }
}

export const getImageAlt = (provider: Provider, data: ImageData): string => {
  if (!data) return 'Anime cover'

  switch (provider) {
    case 'anilist': {
      if (!isAniListAnime(data)) return 'Anime cover'
      return data.title?.romaji || data.title?.english || 'Anime cover'
    }

    case 'omdb': {
      if (!isOMDBAnime(data)) return 'Anime cover'
      return data.Title || 'Anime cover'
    }

    case 'tmdb': {
      if (!isTMDBAnime(data)) return 'Anime cover'
      return data.name || 'Anime cover'
    }

    case 'tvdb': {
      if (!isTVDBAnime(data)) return 'Anime cover'
      return data.name || 'Anime cover'
    }

    case 'tvmaze': {
      if (!isTVMazeAnime(data)) return 'Anime cover'
      return data.show.name || 'Anime cover'
    }

    default:
      return 'Anime cover'
  }
}

export const formatDate = (year?: number, month?: number, day?: number): string => {
  if (!year) return 'Unknown'
  const date = new Date(year, (month ?? 1) - 1, day ?? 1)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const formatDateUS = (dateString: string): string => {
  let date: Date

  // Verificamos si el formato es DD/MM/YYYY (si tiene /)
  if (dateString.includes('/')) {
    // Dividimos la cadena en día, mes y año
    const [day, month, year] = dateString.split('/')

    // Creamos un objeto Date. Restamos 1 al mes porque los meses están en base 0
    date = new Date(Number(year), Number(month) - 1, Number(day))
  } else {
    // Caso DD MMM YYYY (ej. "10 Oct 2022")
    date = new Date(dateString)
  }

  // Formateamos el año, mes y día con padding de ceros si es necesario
  const formattedYear = date.getFullYear()
  const formattedMonth = String(date.getMonth() + 1).padStart(2, '0')
  const formattedDay = String(date.getDate()).padStart(2, '0')

  // Formato final YYYY-MM-DD
  return `${formattedYear}-${formattedMonth}-${formattedDay}`
}
