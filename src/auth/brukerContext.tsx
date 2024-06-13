'use client';

import { createContext, useContext } from 'react';

import { Maybe } from '@io/graphql';

export type Bruker = {
    oid: string;
    epost: string;
    navn: string;
    ident: string;
    grupper: string[];
    isLoggedIn?: boolean;
};

export const BrukerContext = createContext<Maybe<Bruker>>(null);

export const useBruker = (): Bruker => {
    const context = useContext(BrukerContext);
    if (!context) throw new Error('Missing user context');
    return context;
};

export const useBrukerGrupper = (): string[] => {
    const context = useBruker();
    return context.grupper || [];
};

export const useBrukerIdent = (): string => {
    const context = useBruker();
    return context.ident;
};
