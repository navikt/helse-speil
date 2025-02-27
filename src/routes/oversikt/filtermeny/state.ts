import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const useToggleFiltermeny = () => {
    const setShow = useSetAtom(showFiltermeny);
    return () => setShow((show) => !show);
};

export const useShowFiltermeny = (): boolean => useAtomValue(showFiltermeny);

const showFiltermeny = atomWithStorage('showFiltermeny', true);

export const useFiltermenyWidth = () => useAtomValue(filtermenyWidth);

export const useSetFiltermenyWidth = () => {
    const setFiltermenyWidth = useSetAtom(filtermenyWidth);
    return (width: number) => setFiltermenyWidth(width);
};

const filtermenyWidth = atom(320);
