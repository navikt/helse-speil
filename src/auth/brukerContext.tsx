'use client';

import { createContext, useContext } from 'react';

export type Bruker = {
    oid: string;
    epost: string;
    navn: string;
    ident: string;
    grupper: string[];
    isLoggedIn?: boolean;
};

export const BrukerContext = createContext<Bruker | null>(null);

export const useBruker = () => {
    const context = useContext(BrukerContext);
    if (!context) throw new Error('Missing user context');
    return context;
};

export const useBrukerGrupper = () => {
    const context = useBruker();
    return context.grupper || [];
};

export const useBrukerIdent = () => {
    const context = useBruker();
    return context.ident;
};
