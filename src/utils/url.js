export function ensureExternalUrl(url) {
  const value = String(url ?? '').trim()
  if (!value) return ''

  // Keep existing absolute or special protocols untouched.
  if (/^(https?:\/\/|mailto:|tel:)/i.test(value)) return value

  return `https://${value}`
}
