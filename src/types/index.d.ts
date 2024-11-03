export type Provider = 'anilist' | 'anidb' | 'tvdb' | 'tmdb' | 'omdb' | 'fanart' | 'tvmaze'
export type ProviderData = {
  [key in Provider]?: any
}
