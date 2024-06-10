import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

const anonymityState = atom<boolean>({
    key: 'anonymityState',
    default: false,
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                sessionStorage.setItem('agurkmodus', JSON.stringify(newValue));
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
