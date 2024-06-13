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

const showFiltermeny = atom<boolean>({
    key: 'showFiltermeny',
    default: true,
    effects: [syncWithLocalStorageEffect],
});

export const useToggleFiltermeny = () => {
    const setShow = useSetRecoilState(showFiltermeny);
    return () => setShow((show) => !show);
};

export const useShowFiltermeny = (): boolean => useRecoilValue(showFiltermeny);

export const filtermenyWidth = atom<number>({
    key: 'filtermenyWidth',
    default: 320,
});
