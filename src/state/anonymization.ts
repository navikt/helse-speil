import { useAtomValue, useSetAtom } from 'jotai';

import { atomWithLocalStorage } from '@state/jotai';

const anonymityState = atomWithLocalStorage('anonymisering', false, false);

export const useToggleAnonymity = (): (() => void) => {
    const setAnonymity = useSetAtom(anonymityState);
    return () => {
        setAnonymity((prevState) => !prevState);
    };
};

export const useIsAnonymous = () => {
    return useAtomValue(anonymityState);
};
