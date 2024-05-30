import { AtomEffect } from 'recoil';

export function sessionStorageEffect<T>(): AtomEffect<T> {
    return ({ onSet, setSelf, node }) => {
        const savedState = sessionStorage.getItem(node.key);
        if (savedState) {
            setSelf(JSON.parse(savedState));
        }

        onSet((newValue) => {
            sessionStorage.setItem(node.key, JSON.stringify(newValue));
        });
    };
}
