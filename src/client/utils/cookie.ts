export const Keys = {
    NAME: 'name',
    IDENT: 'NAVident',
    EMAIL: 'email'
};

export enum CookieKey {
    Name = 'name',
    Ident = 'NAVident',
    Email = 'email'
}

const extractToken = (cookie: string) =>
    cookie
        .split('=')[1]
        .split('.')[1]
        .replace(/%3D/g, '=')
        .replace(/%3d/g, '=');

const decode = (cookie: string) => {
    const token = extractToken(cookie);
    try {
        return JSON.parse(atob(token));
    } catch (err) {
        console.warn('error while decoding cookie:', err); // eslint-disable-line no-console
        return null;
    }
};

export const extractValues = (values: ArrayLike<any>) => {
    const decodedCookie = document.cookie
        .split(';')
        .filter(item => item.trim().startsWith('speil='))
        .map(decode)
        .pop();

    return decodedCookie ? Array.from(values).map(val => decodedCookie[val]) : [];
};

export const extractName = () => {
    return extractValues([CookieKey.Name]);
};
