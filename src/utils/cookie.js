export const Keys = {
    NAME: 'name',
    IDENT: 'NAVident',
    EMAIL: 'email'
};

const decode = cookie => {
    const token = cookie
        .split('=')[1]
        .split('.')[1]
        .replace(/%3D/g, '=')
        .replace(/%3d/g, '=');
    try {
        return JSON.parse(atob(token));
    } catch (err) {
        console.warn('error while decoding cookie:', err); // eslint-disable-line no-console
        return null;
    }
};

export const extractValues = values => {
    const decodedCookie = document.cookie
        .split(';')
        .filter(item => item.trim().startsWith('speil='))
        .map(decode)
        .pop();

    return Array.from(values).map(val => decodedCookie[val]);
};

export const extractName = () => {
    return extractValues([Keys.NAME]);
};
