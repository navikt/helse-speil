import { atomWithStorage } from 'jotai/utils';

// Jotai's atomWithStorage defaulter til localStorage. Dette er en hjelpefunksjon man kan bruke når man i stedet vil
// lagre i sessionStorage
export function atomWithSessionStorage<T>(key: string, initialValue: T) {
    return atomWithStorage<T>(key, initialValue, {
        getItem: (key) => {
            const storedValue = sessionStorage.getItem(key);
            return storedValue ? (JSON.parse(storedValue) as T) : initialValue;
        },
        setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => sessionStorage.removeItem(key),
    });
}
