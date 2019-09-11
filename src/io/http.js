'use strict';

export const ResponseError = (message, statusCode) => ({
    message,
    statusCode
});

/* eslint-disable no-undef */
const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
/* eslint-enable */

const getData = async response => {
    try {
        return await response.json();
    } catch (e) {
        return undefined;
    }
};

const get = async url => {
    const response = await fetch(url);

    if (response.status >= 400) {
        throw ResponseError(response.statusText, response.status);
    }

    return {
        status: response.status,
        data: await getData(response)
    };
};

export const behandlingerFor = async aktorId => {
    return get(`${baseUrl}/behandlinger/${aktorId}`);
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

export const downloadFeedback = params => {
    const query = params ? `?fraogmed=${params}` : '';
    window.open(`${baseUrl}/feedback${query}`, { target: '_blank' });
};

export const getPerson = async aktorId => {
    return get(`${baseUrl}/person/${aktorId}`);
};
