let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function setRefreshToken(token: string) {
  localStorage.setItem('refresh_token', token);
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

export function clearTokens() {
  accessToken = null;
  localStorage.removeItem('refresh_token');
}
