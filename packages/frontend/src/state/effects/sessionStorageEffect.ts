import { AtomEffect } from 'recoil';

export function sessionStorageEffect<T>(keyOverride?: string): AtomEffect<T> {
    return ({ onSet, setSelf, node }) => {
        if (typeof window === 'undefined') return;
        const savedState = sessionStorage.getItem(keyOverride ?? node.key);
        if (savedState) {
            setSelf(JSON.parse(savedState));
        }

        onSet((newValue) => {
            sessionStorage.setItem(keyOverride ?? node.key, JSON.stringify(newValue));
        });
    };
}
