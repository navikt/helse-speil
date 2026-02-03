'use client';

import { createContext, useContext } from 'react';

export type Bruker = {
    oid: string;
    epost: string;
    navn: string;
    ident: string;
};

export const BrukerContext = createContext<Bruker | null>(null);

export const useBruker = (): Bruker => {
    const context = useContext(BrukerContext);
    if (!context) throw new Error('Missing user context');
    return context;
};

BrukerContext.displayName = 'BrukerContext';
