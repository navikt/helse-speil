import { AtomEffect } from 'recoil';

export const sessionStorageEffect: AtomEffect<any> = ({ onSet, setSelf, node }) => {
    const savedState = sessionStorage.getItem(node.key);
    if (savedState) {
        setSelf(JSON.parse(savedState));
    }

    onSet((newValue) => {
        sessionStorage.setItem(node.key, JSON.stringify(newValue));
    });
};
