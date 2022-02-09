import React, { createContext, FunctionComponent, useState } from 'react';

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
    oppdaterVenterPåEndringState: (state: VenterPåEndringState) => {},
};

export const VenterPåEndringContext = createContext<VenterPåEndringContextState>(initialVenterPåEndringContextState);

export const VenterPåEndringProvider: FunctionComponent = ({ children }) => {
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
