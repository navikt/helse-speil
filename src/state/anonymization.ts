import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

const anonymityState = atom<boolean>({
    key: 'anonymityState',
    default: false,
    effects: [
        () => {
            // Overgangskode for å unngå å miste anonymiseringsflagg, kan sikkert fjernes om noen dager
            const gammelVerdi = localStorage.getItem('agurkmodus');
            if (gammelVerdi !== null) {
                localStorage.removeItem('agurkmodus');
                localStorage.setItem('anonymisering', gammelVerdi);
            }
        },
        ({ onSet }) => {
            onSet((newValue) => {
                localStorage.setItem('anonymisering', JSON.stringify(newValue));
            });
        },
    ],
});

export const useSetAnonymity = () => {
    const setAnonymity = useSetRecoilState(anonymityState);

    return useCallback(
        (value: boolean) => {
            setAnonymity(value);
        },
        [setAnonymity],
    );
};

export const useToggleAnonymity = (): (() => void) => {
    const setAnonymity = useSetRecoilState(anonymityState);
    return () => {
        setAnonymity((prevState) => !prevState);
    };
};

export const useIsAnonymous = () => {
    return useRecoilValue(anonymityState);
};
