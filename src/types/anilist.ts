export interface AniListAnime {
  id: number
  idMal: number
  title: Title
  coverImage: CoverImage
  bannerImage: string
  startDate: EndDateClass
  endDate: EndDateClass
  description: string
  season: string
  seasonYear: number
  type: string
  format: string
  status: string
  episodes: number
  duration: number
  chapters: null
  volumes: null
  genres: string[]
  isAdult: boolean
  averageScore: number
  popularity: number
  studios: Studios
  tags: Tag[]
  trailer: Trailer
  characters: Characters
  imdbData?: IMDbData
}

export interface Characters {
  edges: Edge[]
}

export interface Edge {
  node: Node
  voiceActors: Node[]
}

export interface Node {
  name: Name
  image: Image
}

export interface Image {
  medium: string
}

export interface Name {
  full: string
  native: string
}

export interface CoverImage {
  medium: string
  extraLarge: string
}

export interface EndDateClass {
  year: number
  month: number
  day: number
}

export interface Studios {
  nodes: Tag[]
}

export interface Tag {
  name: string
}

export interface Title {
  romaji: string
  english: string
  native: string
}

export interface Trailer {
  id: string
  site: string
}

export interface IMDbData {
  id: string
  type: string
  primary_title: string
  start_year: number
  end_year?: number
  plot: string
  genres: string[]
  rating: {
    aggregate_rating: number
    votes_count: number
  }
  credits: CastMember[]
  certificates: Certificate[]
  spoken_languages: SpokenLanguage[]
  origin_countries: OriginCountry[]
  seasons: Season[]
  totalSeasons: number
  totalEpisodes: number
}

export interface CastMember {
  id: string
  name: string
  character: string
  image: string | null
}

export interface Certificate {
  country:
  {
    code: string
    name: string
  }
  rating: Rating
}

export interface Rating {
  aggregate_rating: number
  votes_count: number
}

export interface SpokenLanguage {
  code: string
  name: string
}

export interface OriginCountry {
  code: string
  name: string
}

export interface Season {
  seasonNumber: number
  episodes: Episode[]
}

export interface Episode {
  id: string
  seasonNumber: number
  episodeNumber: number
  title: string
  plot: string
  releaseDate: string
}
