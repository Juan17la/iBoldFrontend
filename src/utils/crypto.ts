export const hashPassword = async (password: string): Promise<string> => {
  const normalized = password.trim()
  const encoded = new TextEncoder().encode(normalized)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  const bytes = Array.from(new Uint8Array(digest))
  return btoa(String.fromCharCode(...bytes))
}
