import leoProfanity from 'leo-profanity'

leoProfanity.loadDictionary('ru')
leoProfanity.loadDictionary('en')

export const censorText = (text) => {
  if (!text || typeof text !== 'string') return text
  
  if (leoProfanity.check(text)) {
    return '*'.repeat(text.length)
  }
  
  return text
}

export const containsProfanity = (text) => {
  if (!text || typeof text !== 'string') return false
  return leoProfanity.check(text)
}

export default leoProfanity