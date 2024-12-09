import { atom } from 'recoil';

export const calculatingState = atom<boolean>({
    key: 'calculatingState',
    default: false,
});
