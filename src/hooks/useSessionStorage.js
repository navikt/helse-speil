import { useEffect, useState } from 'react';

/* Utvider useState ved å lagre/hente state i/fra sessionStorage.
 * @param {string} key          nøkkel for lagring i sessionStorage
 * @param {any} initialValue    initiell verdi for state
 * returns {array}              et array bestående av verdien av state og en setState-funksjon
 */
export const useSessionStorage = (key, initialValue) => {
    const [state, setState] = useState(initialValue);

    useEffect(() => {
        if (state !== initialValue) {
            sessionStorage.setItem(key, JSON.stringify(state));
        }
    }, [state]);

    useEffect(() => {
        const sessionState = sessionStorage.getItem(key);
        if (sessionState) {
            const parsedState = JSON.parse(decodeURIComponent(sessionState));
            setState(parsedState);
        }
    }, [key]);

    return [state, setState];
};
