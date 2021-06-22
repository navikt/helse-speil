import { EksternBehandlingstatistikk, SpesialistOppgave } from 'external-types';

import { Avvisningsskjema } from '../routes/saksbilde/venstremeny/utbetaling/Utbetalingsdialog';

import { AnnulleringDTO, Options, OverstyrteDagerDTO, OverstyrtInntektDTO, PersonoppdateringDTO } from './types';

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

export const fetchOppgaver = async () =>
    get(`${baseUrl}/person/`).then((response) => response.data.oppgaver as SpesialistOppgave[]);

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

const postVedtak = async (oppgavereferanse: string, aktørId: string, godkjent: boolean, skjema?: Avvisningsskjema) =>
    post(`${baseUrl}/payments/vedtak`, { oppgavereferanse, aktørId, godkjent, skjema });

export const postUtbetalingsgodkjenning = async (oppgavereferanse: string, aktørId: string) =>
    postVedtak(oppgavereferanse, aktørId, true);

export const postSendTilInfotrygd = async (oppgavereferanse: string, aktørId: string, skjema: Avvisningsskjema) =>
    postVedtak(oppgavereferanse, aktørId, false, skjema);

export const postAnnullering = async (annullering: AnnulleringDTO) =>
    post(`${baseUrl}/payments/annullering`, annullering);

export const postOverstyrteDager = async (overstyring: OverstyrteDagerDTO) =>
    post(`${baseUrl}/overstyring/overstyr/dager`, overstyring);

export const postOverstyrtInntekt = async (overstyring: OverstyrtInntektDTO) =>
    post(`${baseUrl}/overstyring/overstyr/inntekt`, overstyring);

export const postForespørPersonoppdatering = async (oppdatering: PersonoppdateringDTO) =>
    post(`${baseUrl}/person/oppdater`, oppdatering);

export const postLeggPåVent = async (oppgavereferanse: string) =>
    post(`${baseUrl}/leggpaavent/${oppgavereferanse}`, {});

export const deletePåVent = async (oppgavereferanse: string) => del(`${baseUrl}/leggpaavent/${oppgavereferanse}`, {});

export const postTildeling = async (oppgavereferanse: string) => {
    return post(`${baseUrl}/tildeling/${oppgavereferanse}`, {});
};

export const deleteTildeling = async (oppgavereferanse: string) => {
    return del(`${baseUrl}/tildeling/${oppgavereferanse}`, {});
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

export const getBehandlingsstatistikk = async () => {
    return get(`${baseUrl}/behandlingsstatistikk`).then(
        (response) => response.data.behandlingsstatistikk as EksternBehandlingstatistikk
    );
};
