'use client';

import { Dispatch, ReactElement, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

export interface SelectedVedlegg {
    url: string;
    label: string;
}

const SelectedVedleggContext = createContext<SelectedVedlegg | null>(null);
const SetSelectedVedleggContext = createContext<Dispatch<SetStateAction<SelectedVedlegg | null>> | null>(null);

export function SelectedVedleggProvider({ children }: { children: ReactNode }): ReactElement {
    const [selected, setSelected] = useState<SelectedVedlegg | null>(null);

    return (
        <SetSelectedVedleggContext value={setSelected}>
            <SelectedVedleggContext value={selected}>{children}</SelectedVedleggContext>
        </SetSelectedVedleggContext>
    );
}

export const useSelectedVedlegg = (): SelectedVedlegg | null => useContext(SelectedVedleggContext);

export const useSetSelectedVedlegg = (): Dispatch<SetStateAction<SelectedVedlegg | null>> => {
    const setSelected = useContext(SetSelectedVedleggContext);
    if (setSelected === null) {
        throw new Error('useSetSelectedVedlegg må brukes innenfor en SelectedVedleggProvider');
    }
    return setSelected;
};
