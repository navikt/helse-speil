import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const anonymityState = atomWithStorage('anonymisering', false);

export const useToggleAnonymity = (): (() => void) => {
    const setAnonymity = useSetAtom(anonymityState);
    return () => {
        setAnonymity((prevState) => !prevState);
    };
};

export const useIsAnonymous = () => {
    return useAtomValue(anonymityState);
};
