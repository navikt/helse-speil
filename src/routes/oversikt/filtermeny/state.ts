import { atom, useAtomValue, useSetAtom } from 'jotai';

import { atomWithLocalStorage } from '@state/jotai';

export const useToggleFiltermeny = () => {
    const setShow = useSetAtom(showFiltermeny);
    return () => setShow((show) => !show);
};

export const useShowFiltermeny = (): boolean => useAtomValue(showFiltermeny);

const showFiltermeny = atomWithLocalStorage('showFiltermeny', true);

export const useFiltermenyWidth = () => useAtomValue(filtermenyWidth);

export const useSetFiltermenyWidth = () => {
    const setFiltermenyWidth = useSetAtom(filtermenyWidth);
    return (width: number) => setFiltermenyWidth(width);
};

const filtermenyWidth = atom(320);
