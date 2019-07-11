'use strict';

/* eslint-disable no-undef */
const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
/* eslint-enable */

export const behandlingerFor = async aktorId => {
    const response = await fetch(baseUrl + `/behandlinger/${aktorId}`);
    return response.status !== 200 ? null : await response.json();
};

export const postFeedback = async feedback => {
    const options = {
        method: 'POST',
        body: JSON.stringify(feedback)
    };
    const response = await fetch(baseUrl + '/feedback', options);
};
