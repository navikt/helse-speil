import { atom, useSetRecoilState } from 'recoil';

interface Toast {
    key: string;
    message: string;
    timeToLiveMs?: number;
    type?: 'info' | 'advarsel' | 'suksess' | 'feil';
    callback?: () => void;
}

export const useLeggTilEnToast = () => {
    const setToasts = useSetRecoilState(toastsState);

    return (toast: Toast) => {
        setToasts((staleToasts) => [...staleToasts, toast]);
    };
};

export const useFjernEnToast = () => {
    const setToasts = useSetRecoilState(toastsState);

    return (key: string) => {
        setToasts((staleToasts) => staleToasts.filter((toast) => toast.key !== key));
    };
};

export const toastsState = atom<Toast[]>({
    key: 'toastsState',
    default: [],
});
