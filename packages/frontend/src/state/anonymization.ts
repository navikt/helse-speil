import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { sessionStorageEffect } from '@state/effects/sessionStorageEffect';

const getRoot = (): HTMLElement => document.querySelector(':root') as HTMLElement;

const anonymize = () => {
    localStorage.setItem('agurkmodus', 'true');
    const root = getRoot();
    root.style.setProperty('--anonymizable-background', 'var(--anonymous-background)');
    root.style.setProperty('--anonymizable-color', 'var(--anonymous-color)');
    root.style.setProperty('--anonymizable-border-radius', 'var(--anonymous-border-radius)');
    root.style.setProperty('--anonymizable-opacity', 'var(--anonymous-opacity)');
};

const deanonymize = () => {
    localStorage.setItem('agurkmodus', 'false');
    const root = getRoot();
    root.style.setProperty('--anonymizable-background', 'var(--visible-background)');
    root.style.setProperty('--anonymizable-color', 'var(--visible-color)');
    root.style.setProperty('--anonymizable-border-radius', 'var(--visible-border-radius)');
    root.style.setProperty('--anonymizable-opacity', 'var(--visible-opacity)');
};

const isAnonymous = (): boolean => {
    return localStorage.getItem('agurkmodus') === 'true';
};

const anonymityState = atom<boolean>({
    key: 'anonymityState',
    default: false,
    effects: [
        sessionStorageEffect('agurkmodus'),
        ({ onSet }) => {
            onSet((newValue) => {
                if (newValue) anonymize();
                else deanonymize();
            });
        },
    ],
});

export const useToggleAnonymity = (): (() => void) => {
    const setAnonymity = useSetRecoilState(anonymityState);
    return () => {
        setAnonymity((prevState) => !prevState);
    };
};

export const useIsAnonymous = () => {
    return useRecoilValue(anonymityState);
};
