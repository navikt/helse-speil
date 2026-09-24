import React, { PropsWithChildren, ReactElement, createContext, useCallback, useState } from 'react';

interface VurderingspanelState {
    aktivNøkkel: string | null;
    innhold: ReactElement | null;
}

interface VurderingspanelContextState extends VurderingspanelState {
    visVurderingspanel: (nøkkel: string, innhold: ReactElement) => void;
    lukkVurderingspanel: () => void;
}

const initialVurderingspanelContextState: VurderingspanelContextState = {
    aktivNøkkel: null,
    innhold: null,
    visVurderingspanel: () => {
        // do nothing
    },
    lukkVurderingspanel: () => {
        // do nothing
    },
};

export const VurderingspanelContext = createContext<VurderingspanelContextState>(initialVurderingspanelContextState);

export const VurderingspanelProvider = ({ children }: PropsWithChildren) => {
    const [state, setState] = useState<VurderingspanelState>({ aktivNøkkel: null, innhold: null });

    const visVurderingspanel = useCallback((aktivNøkkel: string, innhold: ReactElement) => {
        setState({ aktivNøkkel, innhold });
    }, []);

    const lukkVurderingspanel = useCallback(() => {
        setState({ aktivNøkkel: null, innhold: null });
    }, []);

    return (
        <VurderingspanelContext.Provider value={{ ...state, visVurderingspanel, lukkVurderingspanel }}>
            {children}
        </VurderingspanelContext.Provider>
    );
};

VurderingspanelContext.displayName = 'VurderingspanelContext';
