import { useEffect, useState } from 'react';

/* Utvider useState ved å lagre/hente state i/fra sessionStorage.
 * @param {string} key          nøkkel for lagring i sessionStorage
 * @param {any} initialValue    initiell verdi for state
 * returns {array}              et array bestående av verdien av state og en setState-funksjon
 */
export const useSessionStorage = (key, initialValue) => {
    const [state, setState] = useState(initialValue);
    const [didFetchFromStorage, setDidFetchFromStorage] = useState(false);

    useEffect(() => {
        if (state !== undefined && state !== initialValue) {
            sessionStorage.setItem(key, JSON.stringify(state));
        }
    }, [state]);

    useEffect(() => {
        const sessionState = sessionStorage.getItem(key);
        if (sessionState !== null) {
            const parsedState = parseData(sessionState);
            if (parsedState !== undefined) {
                setState(parsedState);
            } else {
                sessionStorage.removeItem(key);
            }
        }
        setDidFetchFromStorage(true);
    }, [key]);

    const parseData = data => {
        try {
            return JSON.parse(data);
        } catch {
            return undefined;
        }
    };

    return [state, setState, didFetchFromStorage];
};
