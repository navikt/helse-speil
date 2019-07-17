'use strict';

/* eslint-disable no-undef */
const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
/* eslint-enable */

export const behandlingerFor = async aktorId => {
    const response = await fetch(baseUrl + `/behandlinger/${aktorId}`);
    return response.status !== 200 ? null : await response.json();
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
