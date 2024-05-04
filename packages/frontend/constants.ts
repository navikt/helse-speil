const baseUrl: string = import.meta.env.DEV ? 'http://localhost:3000' : '';
const websocketsUrl: string = import.meta.env.DEV ? 'ws://localhost:3000' : `ws://${location.host}`;

export const BASE_URL = baseUrl;
export const WEBSOCKETS_URL = websocketsUrl;
