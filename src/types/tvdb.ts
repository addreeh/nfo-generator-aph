export interface TVDBAnime {
  id: number
  name: string
  slug: string
  image: string
  nameTranslations: string[]
  overviewTranslations: string[]
  aliases: Alias[]
  firstAired: Date
  lastAired: Date
  nextAired: Date
  score: number
  status: AnimeStatus
  originalCountry: OriginalCountry
  originalLanguage: OriginalCountry
  defaultSeasonType: number
  isOrderRandomized: boolean
  lastUpdated: Date
  averageRuntime: number
  episodes: Episode[]
  overview: string
  year: string
  artworks: Artwork[]
  companies: LatestNetwork[]
  originalNetwork: LatestNetwork
  latestNetwork: LatestNetwork
  genres: Genre[]
  trailers: any[]
  lists: List[]
  remoteIds: RemoteID[]
  characters: Character[]
  airsDays: AirsDays
  airsTime: string
  seasons: Season[]
  tags: Tag[]
  contentRatings: ContentRating[]
  seasonTypes: SeasonTypeElement[]
}

export interface AirsDays {
  sunday: boolean
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
}

export interface Alias {
  language: string
  name: string
}

export interface Artwork {
  id: number
  image: string
  thumbnail: string
  language: OriginalCountry | null
  type: number
  score: number
  width: number
  height: number
  includesText: boolean
  thumbnailWidth: number
  thumbnailHeight: number
  updatedAt: number
  status: ArtworkStatus
  tagOptions: null
  seasonId?: number
}

export enum OriginalCountry {
  Eng = 'eng',
  Fra = 'fra',
  Jpn = 'jpn',
  Pol = 'pol',
  SPA = 'spa',
  Zho = 'zho',
}

export interface ArtworkStatus {
  id: number
  name: null
}

export interface Character {
  id: number
  name: string
  peopleId: number
  seriesId: number
  series: null
  movie: null
  movieId: null
  episodeId: null
  type: number
  image: string
  sort: number
  isFeatured: boolean
  url: string
  nameTranslations: null
  overviewTranslations: null
  aliases: null
  peopleType: PeopleType
  personName: string
  tagOptions: null
  personImgURL: null | string
}

export enum PeopleType {
  Actor = 'Actor',
}

export interface LatestNetwork {
  id: number
  name: string
  slug: string
  nameTranslations: OriginalCountry[]
  overviewTranslations: OriginalCountry[]
  aliases: Alias[]
  country: OriginalCountry | null
  primaryCompanyType: number
  activeDate: Date | null
  inactiveDate: null
  companyType: CompanyType
  parentCompany: ParentCompany
  tagOptions: null
}

export interface CompanyType {
  companyTypeId: number
  companyTypeName: string
}

export interface ParentCompany {
  id: number | null
  name: null | string
  relation: Relation
}

export interface Relation {
  id: null
  typeName: null
}

export interface ContentRating {
  id: number
  name: string
  country: string
  description: string
  contentType: string
  order: number
  fullname: null
}

export interface Episode {
  id: number
  seriesId: number
  name: null | string
  aired: Date
  runtime: number | null
  nameTranslations: null
  overview: null | string
  overviewTranslations: null
  image: null | string
  imageType: number | null
  isMovie: number
  seasons: null
  number: number
  absoluteNumber: number
  seasonNumber: number
  lastUpdated: Date
  finaleType: FinaleType | null
  airsBeforeSeason?: number
  airsBeforeEpisode?: number
  year: string
  airsAfterSeason?: number
}

export enum FinaleType {
  Midseason = 'midseason',
  Season = 'season',
}

export interface Genre {
  id: number
  name: string
  slug: string
}

export interface List {
  id: number
  name: string
  overview: null | string
  url: string
  isOfficial: boolean
  nameTranslations: OriginalCountry[]
  overviewTranslations: OriginalCountry[] | null
  aliases: Alias[]
  score: number
  image: string
  imageIsFallback: boolean
  remoteIds: null
  tags: null
}

export interface RemoteID {
  id: string
  type: number
  sourceName: string
}

export interface SeasonTypeElement {
  id: number
  name: Name
  type: TypeEnum
  alternateName: null
}

export enum Name {
  AbsoluteOrder = 'Absolute Order',
  AiredOrder = 'Aired Order',
  DVDOrder = 'DVD Order',
}

export enum TypeEnum {
  Absolute = 'absolute',
  DVD = 'dvd',
  Official = 'official',
}

export interface Season {
  id: number
  seriesId: number
  type: SeasonTypeElement
  name?: string
  number: number
  nameTranslations: string[]
  overviewTranslations: string[]
  image?: string
  imageType?: number
  companies: Companies
  lastUpdated: Date
}

export interface Companies {
  studio: null
  network: null
  production: null
  distributor: null
  special_effects: null
}

export interface AnimeStatus {
  id: number
  name: string
  recordType: string
  keepUpdated: boolean
}

export interface Tag {
  id: number
  tag: number
  tagName: string
  name: string
  helpText: null | string
}
