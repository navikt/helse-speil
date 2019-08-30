import { useEffect, useState } from 'react';

/* Utvider useState ved å lagre/hente state i/fra sessionStorage.
 * @param {string} key          nøkkel for lagring i sessionStorage
 * @param {any} initialValue    initiell verdi for state
 * returns {array}              et array bestående av verdien av state og en setState-funksjon
 */
export const useSessionStorage = (key, initialValue) => {
    const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
    const [state, setState] = useState(initialValue);

    useEffect(() => {
        if (state && state !== initialValue) {
            sessionStorage.setItem(key, JSON.stringify(state));
        }
    }, [state]);

    useEffect(() => {
        const sessionState = sessionStorage.getItem(key);
        if (sessionState) {
            const parsedState = JSON.parse(sessionState);
            if (parsedState) {
                setState(parsedState);
            } else {
                sessionStorage.removeItem(key);
            }
        }
        setHasCheckedStorage(true);
    }, [key]);

    return [state, setState, hasCheckedStorage];
};
