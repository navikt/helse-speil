import { Tildeling } from '../context/types.internal';
import { Options } from './types';
import { Avvisningverdier } from '../routes/Oppsummering/modal/useSkjemaState';

export const ResponseError = (statusCode: number, message?: string) => ({
    statusCode,
    message,
});

/* eslint-disable no-undef */
const baseUrl = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') + '/api';
/* eslint-enable */

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

const get = async (url: string, options?: Options) => {
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

export const fetchPerson = async (personId?: string, innsyn?: boolean) =>
    get(`${baseUrl}/person/sok`, {
        headers: { 'nav-person-id': personId, innsyn: innsyn },
    });

export const fetchBehov = async () => get(`${baseUrl}/person/`);

export const post = async (url: string, data: any) => {
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

export const getTildelinger = async (behandlingsIdList: string[]) => {
    return post(`${baseUrl}/tildeling/list`, behandlingsIdList);
};

export const postTildeling = async (tildeling: Tildeling) => {
    return post(`${baseUrl}/tildeling`, tildeling);
};

export const deleteTildeling = async (behandlingsId: string) => {
    return del(`${baseUrl}/tildeling/${behandlingsId}`);
};

export const postVedtak = async (behovId: string, aktørId: string, godkjent: boolean, skjema?: Avvisningverdier) => {
    return post(`${baseUrl}/payments/vedtak`, { behovId, aktørId, godkjent, skjema });
};

export const postAnnullering = async (annullering: AnnulleringDTO) => {
    const { aktørId, fødselsnummer, organisasjonsnummer, fagsystemId, vedtaksperiodeId } = annullering;
    return post(`${baseUrl}/payments/annullering`, {
        aktørId,
        fødselsnummer,
        organisasjonsnummer,
        fagsystemId,
        vedtaksperiodeId,
    });
};

export interface AnnulleringDTO {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    fagsystemId: string;
    vedtaksperiodeId: string;
}
