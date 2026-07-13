import React, { PropsWithChildren, createContext, useCallback, useState } from 'react';

interface VenterPåEndringState {
    visAngreknapp: boolean;
    visOverstyrKnapp: boolean;
}

const defaultVenterPåEndringState: VenterPåEndringState = {
    visAngreknapp: true,
    visOverstyrKnapp: true,
};

interface VenterPåEndringContextState {
    hentVenterPåEndringState: (nøkkel: string) => VenterPåEndringState;
    oppdaterVenterPåEndringState: (nøkkel: string, state: VenterPåEndringState) => void;
}

const initialVenterPåEndringContextState: VenterPåEndringContextState = {
    hentVenterPåEndringState: () => defaultVenterPåEndringState,
    oppdaterVenterPåEndringState: () => {
        // do nothing
    },
};

export const VenterPåEndringContext = createContext<VenterPåEndringContextState>(initialVenterPåEndringContextState);

export const VenterPåEndringProvider = ({ children }: PropsWithChildren) => {
    // Tilstanden holdes per nøkkel (f.eks. arbeidsforhold) slik at en endring på ett
    // arbeidsforhold ikke påvirker knappene til de andre arbeidsforholdene på siden.
    const [venterPåEndringStateMap, setVenterPåEndringStateMap] = useState<Record<string, VenterPåEndringState>>({});

    const hentVenterPåEndringState = useCallback(
        (nøkkel: string) => venterPåEndringStateMap[nøkkel] ?? defaultVenterPåEndringState,
        [venterPåEndringStateMap],
    );

    const oppdaterVenterPåEndringState = useCallback((nøkkel: string, state: VenterPåEndringState) => {
        setVenterPåEndringStateMap((forrigeState) => ({ ...forrigeState, [nøkkel]: state }));
    }, []);

    return (
        <VenterPåEndringContext.Provider
            value={{
                hentVenterPåEndringState: hentVenterPåEndringState,
                oppdaterVenterPåEndringState: oppdaterVenterPåEndringState,
            }}
        >
            {children}
        </VenterPåEndringContext.Provider>
    );
};

VenterPåEndringContext.displayName = 'VenterPåEndringContext';
