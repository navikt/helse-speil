import { Tildeling } from '../context/types.internal';
import { AnnulleringDTO, Options, OverstyringDTO } from './types';
import { Avvisningverdier } from '../routes/Saksbilde/Oppsummering/modal/useSkjemaState';

export const ResponseError = (statusCode: number, message?: string) => ({
    statusCode,
    message,
});

export interface SpeilResponse {
    status: number;
    data: any;
}

// eslint-disable-next-line no-undef
const baseUrl = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') + '/api';

const getData = async (response: Response) => {
    try {
        return await response.json();
    } catch (e) {
        return undefined;
    }
};

const getErrorMessage = async (response: Response) => {
    try {
        return await response.text();
    } catch (e) {
        return undefined;
    }
};

const ensureAcceptHeader = (options: Options = {}): RequestInit | undefined => {
    const acceptHeader = { Accept: 'application/json' };
    if (!options?.headers) {
        return { ...options, headers: acceptHeader };
    } else if (!options.headers.Accept || !options.headers.accept) {
        return { ...options, headers: { ...acceptHeader, ...options.headers } };
    }
    return undefined;
};

const get = async (url: string, options?: Options): Promise<SpeilResponse> => {
    const response = await fetch(url, ensureAcceptHeader(options));

    if (response.status >= 400) {
        throw ResponseError(response.status);
    }

    return {
        status: response.status,
        data: await getData(response),
    };
};

export const del = async (url: string, data?: any) => {
    const response = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(data),
    });

    if (response.status !== 204) {
        throw ResponseError(response.status);
    }
    return response;
};

export const fetchPerson = async (personId?: string) =>
    get(`${baseUrl}/person/sok`, {
        headers: { 'nav-person-id': personId },
    });

export const fetchOppgaver = async () => get(`${baseUrl}/person/`);

export const post = async (url: string, data: any): Promise<SpeilResponse> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (response.status !== 200 && response.status !== 204) {
        console.log({ response });

        const message = await getErrorMessage(response);
        console.log({ message });

        throw ResponseError(response.status, message);
    }

    return {
        status: response.status,
        data: await getData(response),
    };
};

export const getPersoninfo = async (aktorId: string) => {
    return get(`${baseUrl}/person/${aktorId}/info`);
};

export const postTildeling = async (tildeling: Tildeling) => {
    return post(`${baseUrl}/tildeling`, tildeling);
};

export const deleteTildeling = async (behandlingsId: string) => {
    return del(`${baseUrl}/tildeling/${behandlingsId}`);
};

export const postVedtak = async (
    oppgavereferanse: string,
    aktørId: string,
    godkjent: boolean,
    skjema?: Avvisningverdier
) => {
    return post(`${baseUrl}/payments/vedtak`, { oppgavereferanse, aktørId, godkjent, skjema });
};

export const postAnnullering = async (annullering: AnnulleringDTO) =>
    post(`${baseUrl}/payments/annullering`, annullering);

export const postOverstyring = async (overstyring: OverstyringDTO) =>
    post(`${baseUrl}/overstyring/overstyr/dager`, overstyring);
