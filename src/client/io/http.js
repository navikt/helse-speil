'use strict';

export const ResponseError = (message, statusCode) => ({
    message,
    statusCode
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
        throw ResponseError(response.statusText, response.status);
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
        throw ResponseError(response.statusText, response.status);
    }
    return response;
};

export const behandlingerFor = async aktorId => {
    return get(`${baseUrl}/behandlinger/`, {
        headers: { 'nav-person-id': aktorId }
    });
};

export const behandlingerIPeriode = async (fom, tom) => {
    return get(`${baseUrl}/behandlinger/periode/${fom}/${tom}`);
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
        throw ResponseError(response.statusText, response.status);
    }

    return {
        status: response.status,
        data: await getData(response)
    };
};

export const putFeedback = async feedback => {
    const response = await fetch(baseUrl + '/feedback', {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedback)
    });

    if (response.status !== 204) {
        throw ResponseError(response.statusText, response.status);
    }
};

export const getFeedback = async behandlingsId => {
    return get(`${baseUrl}/feedback/${behandlingsId}`);
};

export const getFeedbackList = async behandlingsIdList => {
    return post(`${baseUrl}/feedback/list`, behandlingsIdList);
};

export const downloadFeedback = params => {
    const query = params ? `?fraogmed=${params}` : '';
    window.open(`${baseUrl}/feedback${query}`, { target: '_blank' });
};

export const getPerson = async aktorId => {
    return get(`${baseUrl}/person/${aktorId}`);
};

export const getTildeling = async behandlingsId => {
    return get(`${baseUrl}/tildeling/${behandlingsId}`);
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
