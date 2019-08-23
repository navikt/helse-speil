'use strict';

jest.genMockFromModule('request');

let stsStatusCode = 0;
let stsResponseBody = {};
let personStatusCode = 0;
let personResponseBody = {};

const setStsStatusCode = code => (stsStatusCode = code);
const setStsResponseBody = body => (stsResponseBody = body);
const setPersonStatusCode = code => (personStatusCode = code);
const setPersonResponseBody = body => (personResponseBody = body);

const get = (url, options, callback) => {
    if (url.includes('/sts/')) {
        callback(
            null,
            { statusCode: stsStatusCode },
            JSON.stringify(stsResponseBody)
        );
    } else {
        callback(
            null,
            { statusCode: personStatusCode },
            JSON.stringify(personResponseBody)
        );
    }
};

module.exports = {
    get: get,
    setStsStatusCode: setStsStatusCode,
    setStsResponseBody: setStsResponseBody,
    setPersonStatusCode: setPersonStatusCode,
    setPersonResponseBody: setPersonResponseBody
};
