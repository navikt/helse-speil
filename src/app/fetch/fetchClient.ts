// Same error shape as the Orval-generated fetch functions throw (override.fetch.forceSuccessResponse)
export type HttpError<T = unknown> = Error & { info?: T; status?: number };

export function getJson<T>(url: string, init?: RequestInit): Promise<T> {
    return fetchJson<T>(url, { ...init, method: 'GET' });
}

export function postJson<T>(url: string, body: unknown, init?: RequestInit): Promise<T> {
    return fetchJson<T>(url, {
        ...init,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...init?.headers },
        body: JSON.stringify(body),
    });
}

async function fetchJson<T>(url: string, init: RequestInit): Promise<T> {
    const response = await fetch(url, init);
    const data = await readBody(response);
    if (!response.ok) {
        const error: HttpError = new Error(`Request failed with status code ${response.status}`);
        error.info = data;
        error.status = response.status;
        throw error;
    }
    return data as T;
}

async function readBody(response: Response): Promise<unknown> {
    if ([204, 205, 304].includes(response.status)) return undefined;
    const text = await response.text();
    if (!text) return undefined;
    if (response.headers.get('content-type')?.includes('json')) return JSON.parse(text);
    return text;
}
