import leoProfanity from 'leo-profanity'

leoProfanity.loadDictionary('ru')

const filter = leoProfanity

export const containsProfanity = (text) => {
  if (!text || typeof text !== 'string') return false
  return filter.check(text)
}

export const censorText = (text) => {
  if (!text || typeof text !== 'string') return text
  return filter.censor(text)
}

export default filter