const baseUrl: string = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : window.location.origin;

export const BASE_URL = baseUrl;
export const WEBSOCKETS_URL = baseUrl.replace(/http/, 'ws');
