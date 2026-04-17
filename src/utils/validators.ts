const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email)

export const isValidPassword = (password: string): boolean => password.trim().length >= 6

export const isValidName = (name: string): boolean => name.trim().length >= 2
