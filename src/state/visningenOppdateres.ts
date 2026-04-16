import { atom, useAtom, useAtomValue } from 'jotai';

const visningenOppdateresState = atom(false);
export const useVisningenOppdateresState = () => useAtom(visningenOppdateresState);
export const useVisningenOppdateresValue = () => useAtomValue(visningenOppdateresState);
