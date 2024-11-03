export interface FanArtAnime {
  name: string
  thetvdb_id: string
  hdtvlogo: Characterart[]
  tvposter: Characterart[]
  clearlogo: Characterart[]
  clearart: Characterart[]
  hdclearart: Characterart[]
  seasonposter: Characterart[]
  showbackground: Characterart[]
  tvthumb: Characterart[]
  tvbanner: Characterart[]
  seasonthumb: Characterart[]
  characterart: Characterart[]
  seasonbanner: Characterart[]
}

export interface Characterart {
  id: string
  url: string
  lang: Lang
  likes: string
  season?: string
}

export enum Lang {
  Empty = '',
  En = 'en',
  Ko = 'ko',
  The00 = '00',
}
