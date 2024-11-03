const LIBRETRANSLATE_API = 'https://libretranslate.de/translate'

export async function translateText (text: string, targetLang: string): Promise<string> {
  const response = await fetch(LIBRETRANSLATE_API, {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      source: 'auto',
      target: targetLang
    }),
    headers: { 'Content-Type': 'application/json' }
  })

  const data = await response.json()
  return data.translatedText
}
