import { Optional, Vedtaksperiode, Tildeling } from '../context/types';
import { Options } from './types';

export const ResponseError = (statusCode: number, message?: string) => ({
    statusCode,
    message
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
        data: await getData(response)
    };
};

export const del = async (url: string, data?: any) => {
    const response = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(data)
    });

    if (response.status !== 204) {
        throw ResponseError(response.status);
    }
    return response;
};

export const fetchPerson = async (personId?: string, innsyn?: boolean) => {
    return get(`${baseUrl}/person/sok`, {
        headers: { 'nav-person-id': personId, innsyn: innsyn }
    });
};

export const fetchBehovoversikt = async () => {
    return get(`${baseUrl}/person/`);
};

export const post = async (url: string, data: any) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.status !== 200 && response.status !== 204) {
        console.log({ response });

        const message = await getErrorMessage(response);
        console.log({ message });

        throw ResponseError(response.status, message);
    }

    return {
        status: response.status,
        data: await getData(response)
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

export const postVedtak = async (
    behovId?: string,
    aktørId?: string,
    godkjent?: boolean,
    vedtaksperiodeId?: string
) => {
    return post(`${baseUrl}/payments/vedtak`, { behovId, aktørId, godkjent, vedtaksperiodeId });
};

export const postSimulering = async (
    vedtaksperiode: Vedtaksperiode,
    aktørId: string,
    orgnr: string,
    fødselsnummer: string,
    erUtvidelse: boolean,
    saksbehandlerIdent?: string
) => {
    return post(`${baseUrl}/payments/simulate`, {
        vedtaksperiode,
        saksbehandlerIdent,
        fødselsnummer,
        aktørId,
        orgnr,
        erUtvidelse
    });
};

export const postAnnullering = async (
    fødselsnummer: string,
    utbetalingsreferanse: string,
    aktørId?: string
) => {
    console.log({ fødselsnummer }, { utbetalingsreferanse });

    return post(`${baseUrl}/payments/annullering`, {
        utbetalingsreferanse,
        aktørId,
        fødselsnummer
    });
};
