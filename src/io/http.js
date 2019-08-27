'use strict';

/* eslint-disable no-undef */
const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
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

    if (!response) {
        throw Error();
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
        throw Error();
    }
};

export const getFeedback = async behandlingsId => {
    return get(`${baseUrl}/feedback/${behandlingsId}`);
};

export const getPerson = async aktorId => {
    return get(`${baseUrl}/person/${aktorId}`);
};
