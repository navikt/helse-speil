'use strict';

/* eslint-disable no-undef */
const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
/* eslint-enable */

export const behandlingerFor = async aktorId => {
    const response = await fetch(baseUrl + `/behandlinger/${aktorId}`);
    return {
        status: response.status,
        data:
            response.status === 200
                ? await response.json()
                : `Fant ingen behandlinger for ${aktorId}`
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
        throw Error();
    }
};
