import { AtomEffect, atom, useRecoilValue, useSetRecoilState } from 'recoil';

const syncWithLocalStorageEffect: AtomEffect<boolean> = ({ onSet, setSelf }) => {
    if (typeof window === 'undefined') return;

    const key = 'showFiltermeny';
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
        setSelf(savedValue === 'true');
    }
    onSet((newValue) => {
        localStorage.setItem(key, `${newValue}`);
    });
};

export const useToggleFiltermeny = () => {
    const setShow = useSetRecoilState(showFiltermeny);
    return () => setShow((show) => !show);
};

export const useShowFiltermeny = (): boolean => useRecoilValue(showFiltermeny);

const showFiltermeny = atom<boolean>({
    key: 'showFiltermeny',
    default: true,
    effects: [syncWithLocalStorageEffect],
});

export const useFiltermenyWidth = () => useRecoilValue(filtermenyWidthState);
export const useSetFiltermenyWidth = () => {
    const setFiltermenyWidth = useSetRecoilState(filtermenyWidthState);
    return (width: number) => setFiltermenyWidth(width);
};

const filtermenyWidthState = atom<number>({
    key: 'filtermenyWidth',
    default: 320,
});
