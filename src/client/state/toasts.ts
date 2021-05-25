import { ReactNode } from 'react';
import { atom, useSetRecoilState } from 'recoil';

export interface ToastObject {
    key: string;
    message: ReactNode;
    timeToLiveMs?: number;
    type?: 'info' | 'advarsel' | 'suksess' | 'feil';
    callback?: () => void;
}

export const useAddToast = () => {
    const setToasts = useSetRecoilState(toastsState);

    return (toast: ToastObject) => {
        setToasts((staleToasts) => [...staleToasts.filter((it) => it.key !== toast.key), toast]);
    };
};

export const useRemoveToast = () => {
    const setToasts = useSetRecoilState(toastsState);

    return (key: string) => {
        setToasts((staleToasts) => staleToasts.filter((toast) => toast.key !== key));
    };
};

export const toastsState = atom<ToastObject[]>({
    key: 'toastsState',
    default: [],
});
