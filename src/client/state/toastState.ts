import { atom } from 'recoil';

export const toastState = atom<string | undefined>({
    key: 'toast',
    default: '',
});
