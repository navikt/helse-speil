const baseUrl: string = import.meta.env.DEV ? 'http://localhost:3000' : window.location.origin;

export const BASE_URL = baseUrl;
export const WEBSOCKETS_URL = baseUrl.replace(/http/, 'ws');
