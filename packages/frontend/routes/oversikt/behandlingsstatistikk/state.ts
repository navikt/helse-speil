import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil';

const getDefaultFromStorage = (): boolean | null => {
    switch (localStorage.getItem('showStatistikk')) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return null;
    }
};

const _showStatistikk = atom<boolean>({
    key: '_showStatistikk',
    default: getDefaultFromStorage() ?? true,
});

const showStatistikk = selector<boolean>({
    key: 'showStatistikk',
    get: ({ get }) => get(_showStatistikk),
    set: ({ set }, newValue) => {
        localStorage.setItem('showStatistikk', `${newValue}`);
        set(_showStatistikk, newValue);
    },
});

export const useToggleStatistikk = () => {
    const setShow = useSetRecoilState(showStatistikk);
    return () => setShow((show) => !show);
};

export const useShowStatistikkState = () => useRecoilState(showStatistikk);
