import React, { PropsWithChildren, createContext, useState } from 'react';

interface VenterPåEndringState {
    visAngreknapp: boolean;
    visOverstyrKnapp: boolean;
}

interface VenterPåEndringContextState {
    venterPåEndringState: VenterPåEndringState;
    oppdaterVenterPåEndringState: (state: VenterPåEndringState) => void;
}

const initialVenterPåEndringContextState: VenterPåEndringContextState = {
    venterPåEndringState: {
        visAngreknapp: true,
        visOverstyrKnapp: true,
    },
    oppdaterVenterPåEndringState: () => {
        // do nothing
    },
};

export const VenterPåEndringContext = createContext<VenterPåEndringContextState>(initialVenterPåEndringContextState);

export const VenterPåEndringProvider = ({ children }: PropsWithChildren) => {
    const [venterPåEndringState, oppdaterVenterPåEndringState] = useState<VenterPåEndringState>({
        visAngreknapp: true,
        visOverstyrKnapp: true,
    });

    return (
        <VenterPåEndringContext.Provider
            value={{
                venterPåEndringState: venterPåEndringState,
                oppdaterVenterPåEndringState: oppdaterVenterPåEndringState,
            }}
        >
            {children}
        </VenterPåEndringContext.Provider>
    );
};
