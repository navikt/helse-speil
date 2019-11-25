'use strict';

export const ResponseError = (statusCode, message) => ({
    statusCode,
    message
});

/* eslint-disable no-undef */
const baseUrl = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') + '/api';
/* eslint-enable */

const getData = async response => {
    try {
        return await response.json();
    } catch (e) {
        return undefined;
    }
};

const ensureAcceptHeader = (options = {}) => {
    const acceptHeader = {
        Accept: 'application/json'
    };
    if (!options?.headers) {
        return { ...options, headers: acceptHeader };
    } else if (!options.headers.Accept || !options.headers.accept) {
        return { ...options, headers: { ...acceptHeader, ...options.headers } };
    }
};

const get = async (url, options) => {
    const response = await fetch(url, ensureAcceptHeader(options));

    if (response.status >= 400) {
        throw ResponseError(response.status);
    }

    return {
        status: response.status,
        data: await getData(response)
    };
};

export const del = async (url, data) => {
    const response = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(data)
    });

    if (response.status !== 204) {
        throw ResponseError(response.status);
    }
    return response;
};

export const fetchPerson = async (personId, innsyn) => {
    return get(`${baseUrl}/person/sok`, {
        headers: { 'nav-person-id': personId, innsyn: innsyn }
    });
};

export const fetchSaksoversikt = async () => {
    return get(`${baseUrl}/person/`);
};

export const post = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.status !== 200 && response.status !== 204) {
        const message = await getData(response);
        throw ResponseError(response.status, message);
    }

    return {
        status: response.status,
        data: await getData(response)
    };
};

export const getPersoninfo = async aktorId => {
    return get(`${baseUrl}/person/${aktorId}/info`);
};

export const getTildelinger = async behandlingsIdList => {
    return post(`${baseUrl}/tildeling/list`, behandlingsIdList);
};

export const postTildeling = async tildeling => {
    return post(`${baseUrl}/tildeling`, tildeling);
};

export const deleteTildeling = async behandlingsId => {
    return del(`${baseUrl}/tildeling/${behandlingsId}`);
};

export const postVedtak = async (behovId, aktørId, godkjent) => {
    return post(`${baseUrl}/payments/vedtak`, { behovId, aktørId, godkjent });
};

export const postSimulering = async (sak, saksbehandlerIdent) => {
    return post(`${baseUrl}/payments/simulate`, { sak, saksbehandlerIdent });
};
