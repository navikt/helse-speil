import { AtomEffect, atom, useRecoilValue, useSetRecoilState } from 'recoil';

const syncWithLocalStorageEffect: AtomEffect<boolean> = ({ onSet, setSelf }) => {
    const key = 'showStatistikk';
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
        setSelf(savedValue === 'true');
    }
    onSet((newValue) => {
        localStorage.setItem(key, `${newValue}`);
    });
};

const showStatistikk = atom<boolean>({
    key: 'showStatistikk',
    default: true,
    effects: [syncWithLocalStorageEffect],
});

export const useToggleStatistikk = () => {
    const setShow = useSetRecoilState(showStatistikk);
    return () => setShow((show) => !show);
};

export const useShowStatistikk = () => useRecoilValue(showStatistikk);
