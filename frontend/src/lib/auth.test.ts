import { setAccessToken, getAccessToken, setRefreshToken, getRefreshToken, clearTokens } from './auth';

describe('auth token helpers', () => {
  afterEach(() => {
    clearTokens();
    localStorage.clear();
  });

  it('sets and gets access token in memory', () => {
    expect(getAccessToken()).toBeNull();
    setAccessToken('abc');
    expect(getAccessToken()).toBe('abc');
  });

  it('stores refresh token in localStorage', () => {
    setRefreshToken('rt');
    expect(getRefreshToken()).toBe('rt');
  });

  it('clearTokens resets both', () => {
    setAccessToken('abc');
    setRefreshToken('rt');
    clearTokens();
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});
