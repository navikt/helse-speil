import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode } from 'react';

export interface ToastObject {
    key: string;
    message: ReactNode;
    timeToLiveMs?: number;
    variant?: 'success' | 'error';
    callback?: () => void;
}

export const useToasts = () => useAtomValue(toastsState);

export const useAddToast = () => {
    const addToast = useSetAtom(addToastAtom);

    return (toast: ToastObject) => {
        addToast(toast);
    };
};

export const useRemoveToast = () => {
    const setToasts = useSetAtom(toastsState);

    return (key: string) => {
        setToasts((staleToasts) => staleToasts.filter((toast) => toast.key !== key));
    };
};

const addToastAtom = atom(null, (_, set, newToast: ToastObject) => {
    set(toastsState, (staleToasts) => [...staleToasts.filter((it) => it.key !== newToast.key), newToast]);
    if (typeof newToast?.timeToLiveMs === 'number') {
        setTimeout(() => {
            set(toastsState, (staleToasts) => {
                if (!Array.isArray(staleToasts)) {
                    return staleToasts;
                }
                return staleToasts.filter((toast) => toast.key !== newToast.key);
            });
        }, newToast.timeToLiveMs);
    }
});

const toastsState = atom<ToastObject[]>([]);
