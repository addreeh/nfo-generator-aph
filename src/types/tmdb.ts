export interface TMDBAnime {
  adult: boolean
  backdrop_path: string
  created_by: any[]
  episode_run_time: number[]
  first_air_date: Date
  genres: Genre[]
  homepage: string
  id: number
  in_production: boolean
  languages: OriginalLanguage[]
  last_air_date: Date
  last_episode_to_air: LastEpisodeToAir
  name: string
  next_episode_to_air: LastEpisodeToAir
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  origin_country: OriginCountry[]
  original_language: OriginalLanguage
  original_name: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: Network[]
  production_countries: ProductionCountry[]
  seasons: Season[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  type: string
  vote_average: number
  vote_count: number
  credits: Credits
  videos: Videos
  external_ids: ExternalIDS
  recommendations: Recommendations
  keywords: Keywords
  similar: Recommendations
  content_ratings: ContentRatings
  images: AnimeImages
  formatted_runtime: string
  formatted_date: string
  year: number
  status_translated: string
}

export interface ContentRatings {
  results: ContentRatingsResult[]
}

export interface ContentRatingsResult {
  descriptors: any[]
  iso_3166_1: string
  rating: string
}

export interface Credits {
  cast: Cast[]
  crew: Cast[]
}

export interface Cast {
  adult: boolean
  gender: number
  id: number
  known_for_department: Department
  name: string
  original_name: string
  popularity: number
  profile_path: null | string
  character?: string
  credit_id: string
  order?: number
  department?: Department
  job?: Job
}

export enum Department {
  Acting = 'Acting',
  Art = 'Art',
  Camera = 'Camera',
  Crew = 'Crew',
  Directing = 'Directing',
  Editing = 'Editing',
  Production = 'Production',
  Sound = 'Sound',
  VisualEffects = 'Visual Effects',
  Writing = 'Writing',
}

export enum Job {
  Animation = 'Animation',
  AnimationDirector = 'Animation Director',
  ArtDesigner = 'Art Designer',
  ArtDirection = 'Art Direction',
  AssistantArtDirector = 'Assistant Art Director',
  AssistantDirector = 'Assistant Director',
  AssistantDirectorOfPhotography = 'Assistant Director of Photography',
  BackgroundDesigner = 'Background Designer',
  CGIDirector = 'CGI Director',
  CharacterDesigner = 'Character Designer',
  CoDirector = 'Co-Director',
  ColorDesigner = 'Color Designer',
  CompositingArtist = 'Compositing Artist',
  Director = 'Director',
  DirectorOfPhotography = 'Director of Photography',
  Editor = 'Editor',
  KeyAnimation = 'Key Animation',
  LineProducer = 'Line Producer',
  MusicProducer = 'Music Producer',
  OpeningEndingAnimation = 'Opening/Ending Animation',
  OriginalMusicComposer = 'Original Music Composer',
  Producer = 'Producer',
  ProductionAssistant = 'Production Assistant',
  PropDesigner = 'Prop Designer',
  SeriesComposition = 'Series Composition',
  SeriesDirector = 'Series Director',
  SoundDirector = 'Sound Director',
  SoundEffects = 'Sound Effects',
  SoundMixer = 'Sound Mixer',
  StoryboardArtist = 'Storyboard Artist',
  SupervisingAnimationDirector = 'Supervising Animation Director',
  ThemeSongPerformance = 'Theme Song Performance',
  VFXSupervisor = 'VFX Supervisor',
  Writer = 'Writer',
}

export interface ExternalIDS {
  imdb_id: string
  freebase_mid: string
  freebase_id: null
  tvdb_id: number
  tvrage_id: null
  wikidata_id: string
  facebook_id: null
  instagram_id: null
  twitter_id: null
}

export interface Genre {
  id: number
  name: string
}

export interface AnimeImages {
  posters: Backdrop[]
  backdrops: Backdrop[]
  logos: Backdrop[]
}

export interface Backdrop {
  aspect_ratio: number
  height: number
  iso_639_1: OriginalLanguage | null
  file_path: string
  vote_average: number
  vote_count: number
  width: number
  urls: Urls
}

export enum OriginalLanguage {
  En = 'en',
  Es = 'es',
  He = 'he',
  Ja = 'ja',
  Ru = 'ru',
  Uk = 'uk',
  Zh = 'zh',
}

export interface Urls {
  original: string
  w500: string
  w780: string
  w342?: string
}

export interface Keywords {
  results: Genre[]
}

export interface LastEpisodeToAir {
  id: number
  name: string
  overview: string
  vote_average: number
  vote_count: number
  air_date: Date
  episode_number: number
  episode_type: EpisodeType
  production_code: string
  runtime: number | null
  season_number: number
  show_id: number
  still_path: null | string
  crew?: Cast[]
  guest_stars?: Cast[]
}

export enum EpisodeType {
  Finale = 'finale',
  MidSeason = 'mid_season',
  Standard = 'standard',
}

export interface Network {
  id: number
  logo_path: null | string
  name: string
  origin_country: OriginCountry
}

export enum OriginCountry {
  CA = 'CA',
  CN = 'CN',
  Jp = 'JP',
  Us = 'US',
}

export interface ProductionCountry {
  iso_3166_1: OriginCountry
  name: string
}

export interface Recommendations {
  page: number
  results: RecommendationsResult[]
  total_pages: number
  total_results: number
}

export interface RecommendationsResult {
  backdrop_path: string
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string
  media_type?: MediaType
  adult: boolean
  original_language: OriginalLanguage
  genre_ids: number[]
  popularity: number
  first_air_date: Date
  vote_average: number
  vote_count: number
  origin_country: OriginCountry[]
}

export enum MediaType {
  Tv = 'tv',
}

export interface Season {
  _id: string
  air_date: Date
  episodes: LastEpisodeToAir[]
  name: string
  overview: string
  id: number
  poster_path: string
  season_number: number
  vote_average: number
  images: SeasonImages
}

export interface SeasonImages {
  posters: Backdrop[]
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: OriginalLanguage
  name: string
}

export interface Videos {
  results: VideosResult[]
}

export interface VideosResult {
  iso_639_1: OriginalLanguage
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: Date
  id: string
  url: string
}
