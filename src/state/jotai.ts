import { atomWithStorage, createJSONStorage } from 'jotai/utils';

// Jotai's atomWithStorage defaulter til localStorage. Dette er en hjelpefunksjon man kan bruke når man i stedet vil
// lagre i sessionStorage
export function atomWithSessionStorage<T>(key: string, initialValue: T) {
    return atomWithStorage<T>(
        key,
        initialValue,
        createJSONStorage(() => (typeof window !== 'undefined' ? sessionStorage : (undefined as unknown as Storage))),
        {
            getOnInit: true,
        },
    );
}

export function atomWithLocalStorage<T>(key: string, initialValue: T, getOnInit: boolean = true) {
    return atomWithStorage<T>(key, initialValue, undefined, { getOnInit });
}
