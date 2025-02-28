import { atom, useAtom, useAtomValue } from 'jotai';

const calculatingState = atom(false);
export const useCalculatingState = () => useAtom(calculatingState);
export const useCalculatingValue = () => useAtomValue(calculatingState);
