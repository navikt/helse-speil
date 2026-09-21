import { useSyncExternalStore } from 'react';

const ANONYMISERING_KEY = 'anonymisering';

export const useIsAnonymous = (): boolean => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export const useToggleAnonymity = (): (() => void) => {
    return () => {
        localStorage.setItem(ANONYMISERING_KEY, String(!getSnapshot()));
        window.dispatchEvent(new Event('storage'));
    };
};

function subscribe(onStoreChange: () => void): () => void {
    window.addEventListener('storage', onStoreChange);
    return () => window.removeEventListener('storage', onStoreChange);
}

function getSnapshot(): boolean {
    return localStorage.getItem(ANONYMISERING_KEY) === 'true';
}

function getServerSnapshot(): boolean {
    return false;
}
