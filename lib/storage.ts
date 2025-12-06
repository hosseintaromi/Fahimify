export const AUTH_STORAGE_KEY = "fahimify-authenticated"
export const ONBOARDING_STORAGE_KEY = "fahimify-has-onboarded"

export const readClientFlag = (key: string) => {
  if (typeof window === "undefined") {
    return null
  }
  return localStorage.getItem(key)
}

export const writeClientFlag = (key: string, value: string) => {
  if (typeof window === "undefined") {
    return
  }
  localStorage.setItem(key, value)
}

