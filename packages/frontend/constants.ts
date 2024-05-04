const baseUrl: string = import.meta.env.DEV ? 'http://localhost:3000' : '';
const websocketsUrl: string = import.meta.env.DEV ? 'ws://localhost:3001' : `ws://${window.location.host}:3001`;

export const BASE_URL = baseUrl;
export const WEBSOCKETS_URL = websocketsUrl;
