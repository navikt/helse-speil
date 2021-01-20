import { Tildeling } from 'internal-types';
import { extractSpesialistToken } from '../utils/cookie';
import { AnnulleringDTO, Options, OverstyringDTO, PersonoppdateringDTO } from './types';
import { speilTildeling } from '../featureToggles';
import { Avvisningsskjema } from '../routes/saksbilde/utbetaling/Oppsummering/utbetaling/Utbetalingsdialog';

export const ResponseError = (statusCode: number, message?: string) => ({
    statusCode,
    message,
});

export interface SpeilResponse {
    status: number;
    data: any;
}

type Headers = { [key: string]: any };

// eslint-disable-next-line no-undef
const baseUrl = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') + '/api';

const baseUrlSpesialist = process.env.NODE_ENV === 'development' ? 'http://localhost:9001/api/v1' : '/api/v1';

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

export const del = async (url: string, data?: any, options?: Options) => {
    const response = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(data),
        ...options,
    });

    if (response.status >= 400) {
        throw ResponseError(response.status);
    }
    return response;
};

export const fetchPerson = async (personId?: string) =>
    get(`${baseUrl}/person/sok`, {
        headers: { 'nav-person-id': personId },
    });

export const fetchOppgaver = async () => get(`${baseUrl}/person/`);

export const post = async (url: string, data: any, headere?: Headers): Promise<SpeilResponse> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            ...headere,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (response.status !== 200 && response.status !== 204) {
        const message = await getErrorMessage(response);
        console.log(response.status, message);

        throw ResponseError(response.status, message);
    }

    return {
        status: response.status,
        data: await getData(response),
    };
};

export const getPersoninfo = async (aktorId: string) => get(`${baseUrl}/person/${aktorId}/info`);

const postVedtak = async (oppgavereferanse: string, aktørId: string, godkjent: boolean, skjema?: Avvisningsskjema) =>
    post(`${baseUrl}/payments/vedtak`, { oppgavereferanse, aktørId, godkjent, skjema });

export const postUtbetalingsgodkjenning = async (oppgavereferanse: string, aktørId: string) =>
    postVedtak(oppgavereferanse, aktørId, true);

export const postSendTilInfotrygd = async (oppgavereferanse: string, aktørId: string, skjema: Avvisningsskjema) =>
    postVedtak(oppgavereferanse, aktørId, false, skjema);

export const postAnnullering = async (annullering: AnnulleringDTO) =>
    post(`${baseUrl}/payments/annullering`, annullering);

export const postOverstyring = async (overstyring: OverstyringDTO) =>
    post(`${baseUrl}/overstyring/overstyr/dager`, overstyring);

export const postForespørPersonoppdatering = async (oppdatering: PersonoppdateringDTO) =>
    post(`${baseUrl}/person/oppdater`, oppdatering);

const spesialistAuthorization = () => ({ Authorization: `Bearer ${extractSpesialistToken()}` });

const spesialistOptions = (headere?: Headers) => ({
    headers: {
        ...headere,
        ...spesialistAuthorization(),
    },
});

export const getOppgavereferanse = async (fødselsnummer: string) =>
    get(`${baseUrlSpesialist}/oppgave`, spesialistOptions({ fodselsnummer: fødselsnummer }));

export const postTildeling = async (tildeling: Tildeling) => {
    if (speilTildeling) {
        return post(`${baseUrl}/tildeling/${tildeling.oppgavereferanse}`, {});
    } else {
        return post(`${baseUrlSpesialist}/tildeling/${tildeling.oppgavereferanse}`, {}, spesialistAuthorization());
    }
};

export const deleteTildeling = async (oppgavereferanse: string) => {
    if (speilTildeling) {
        return del(`${baseUrl}/tildeling/${oppgavereferanse}`, {});
    } else {
        return del(`${baseUrlSpesialist}/tildeling/${oppgavereferanse}`, {}, spesialistOptions());
    }
};

export const postAbonnerPåAktør = async (aktørId: string) => {
    return post(`${baseUrl}/opptegnelse/abonner/${aktørId}`, {});
};

export const getAlleOpptegnelser = async () => {
    return get(`${baseUrl}/opptegnelse/hent`);
};

export const getOpptegnelser = async (sisteSekvensId?: number) => {
    return sisteSekvensId ? get(`${baseUrl}/opptegnelse/hent/${sisteSekvensId}`) : get(`${baseUrl}/opptegnelse/hent`);
};
