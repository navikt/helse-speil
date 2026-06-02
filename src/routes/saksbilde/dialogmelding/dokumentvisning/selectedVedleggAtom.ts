import { atom, useAtomValue, useSetAtom } from 'jotai';

export interface SelectedVedlegg {
    url: string;
    label: string;
}

const selectedVedleggAtom = atom<SelectedVedlegg | null>(null);

export const useSelectedVedlegg = () => useAtomValue(selectedVedleggAtom);
export const useSetSelectedVedlegg = () => useSetAtom(selectedVedleggAtom);
