export interface TVMazeImage {
  id: number
  type: string
  main: boolean
  resolutions: {
    original: {
      url: string
      width: number
      height: number
    }
    medium?: {
      url: string
      width: number
      height: number
    }
  }
}

export interface TVMazeCastMember {
  person: {
    id: number
    name: string
    image?: {
      medium: string
      original: string
    }
    birthday?: string
    deathday?: string
    gender?: string
    country?: {
      name: string
      code: string
    }
  }
  character: {
    id: number
    name: string
    image?: {
      medium: string
      original: string
    }
  }
  self: boolean
  voice: boolean
}

export interface TVMazeShow {
  id: number
  name: string
  type: string
  language: string
  genres: string[]
  status: string
  runtime: number | null
  averageRuntime: number | null
  premiered: string | null
  ended: string | null
  officialSite: string | null
  schedule: {
    time: string
    days: string[]
  }
  rating: {
    average: number | null
  }
  weight: number
  network: {
    id: number
    name: string
    country: {
      name: string
      code: string
      timezone: string
    }
  } | null
  webChannel: {
    id: number
    name: string
    country: null | {
      name: string
      code: string
      timezone: string
    }
  } | null
  externals: {
    tvrage: number | null
    thetvdb: number | null
    imdb: string | null
  }
  image: {
    medium: string
    original: string
  } | null
  summary: string | null
}

export interface TVMazeEpisode {
  id: number
  name: string
  season: number
  number: number
  type: string
  airdate: string
  airtime: string
  airstamp: string
  runtime: number | null
  rating: {
    average: number | null
  }
  image: {
    medium: string
    original: string
  } | null
  summary: string | null
}

export interface TVMazeSeason {
  id: number
  number: number
  name: string
  episodeOrder: number | null
  premiereDate: string | null
  endDate: string | null
  network: {
    id: number
    name: string
    country: {
      name: string
      code: string
      timezone: string
    }
  } | null
  webChannel: null | {
    id: number
    name: string
    country: {
      name: string
      code: string
      timezone: string
    }
  }
  image: {
    medium: string
    original: string
  } | null
  summary: string | null
  episodes?: TVMazeEpisode[]
}

export interface TVMazeAnime {
  show: TVMazeShow
  seasons: TVMazeSeason[]
  cast: TVMazeCastMember[]
  images: TVMazeImage[]
  episodes: TVMazeEpisode[]
}
