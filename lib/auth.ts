export const saveAccessToken = (token: string) => {
  // Store in localStorage for persistence
  localStorage.setItem('accessToken', token)
}

export const getAccessToken = () => {
  return localStorage.getItem('accessToken')
}

export const removeAccessToken = () => {
  localStorage.removeItem('accessToken')
} 