'use strict';

const extractName = () => {
    return document.cookie
        .split(';')
        .filter(item => item.trim().startsWith('speil='))
        .map(decode)
        .pop();
};

const decode = cookie => {
    const jwt = cookie.split('=')[1];
    try {
        const tokenBody = jwt
            .split('.')[1]
            .replace(/%3D/g, '=')
            .replace(/%3d/g, '=');
        return JSON.parse(atob(tokenBody))['name'];
    } catch (err) {
        console.log(`error while extracting name: ${err}`); // eslint-disable-line no-console
        return null;
    }
};

export default extractName;
