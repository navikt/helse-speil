import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

const root: HTMLElement = document.querySelector(':root') as HTMLElement;

const anonymize = () => {
    localStorage.setItem('agurkmodus', 'true');
    root.style.setProperty('--anonymizable-background', 'var(--anonymous-background)');
    root.style.setProperty('--anonymizable-color', 'var(--anonymous-color)');
    root.style.setProperty('--anonymizable-border-radius', 'var(--anonymous-border-radius)');
    root.style.setProperty('--anonymizable-opacity', 'var(--anonymous-opacity)');
};

const deanonymize = () => {
    localStorage.setItem('agurkmodus', 'false');
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
    default: (() => {
        if (isAnonymous()) {
            anonymize();
        } else {
            deanonymize();
        }
        return isAnonymous();
    })(),
});

const toggleAnonymity = (): void => {
    if (isAnonymous()) {
        deanonymize();
    } else {
        anonymize();
    }
};

export const useToggleAnonymity = (): (() => void) => {
    const setAnonymity = useSetRecoilState(anonymityState);
    return () => {
        toggleAnonymity();
        setAnonymity(localStorage.getItem('agurkmodus') === 'true');
    };
};

export const useIsAnonymous = () => {
    return useRecoilValue(anonymityState);
};
