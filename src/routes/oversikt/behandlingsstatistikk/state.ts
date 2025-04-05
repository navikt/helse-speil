import { useAtomValue, useSetAtom } from 'jotai';

import { atomWithLocalStorage } from '@state/jotai';

const showStatistikk = atomWithLocalStorage('showStatistikk', true, false);

export const useToggleStatistikk = () => {
    const setShow = useSetAtom(showStatistikk);
    return () => setShow((show) => !show);
};

export const useShowStatistikk = (): boolean => useAtomValue(showStatistikk);
