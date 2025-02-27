import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const showStatistikk = atomWithStorage('showStatistikk', true);

export const useToggleStatistikk = () => {
    const setShow = useSetAtom(showStatistikk);
    return () => setShow((show) => !show);
};

export const useShowStatistikk = (): boolean => useAtomValue(showStatistikk);
