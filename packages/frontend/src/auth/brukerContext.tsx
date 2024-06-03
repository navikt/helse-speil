import { createContext, useContext } from 'react';

export type User = {
    oid: string;
    epost: string;
    navn: string;
    ident?: string;
    isLoggedIn?: boolean;
};

export const BrukerContext = createContext<User | null>(null);

export const useBruker = () => {
    const context = useContext(BrukerContext);
    if (!context) throw new Error('Missing user context');
    return context;
};
