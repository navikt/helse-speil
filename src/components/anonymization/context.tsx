'use client';

import { PropsWithChildren, ReactElement, createContext, useContext, useEffect, useSyncExternalStore } from 'react';

const ANONYMISERING_KEY = 'anonymisering';

type AnonymizationContextType = {
    isAnonymized: boolean;
    toggle: () => void;
};

const AnonymizationContext = createContext<AnonymizationContextType | null>(null);

export function useAnonymizationContext(): AnonymizationContextType {
    const context = useContext(AnonymizationContext);
    if (!context) {
        throw new Error('useAnonymizationContext må brukes inne i en AnonymizationProvider');
    }
    return context;
}

export function useIsAnonymous(): boolean {
    return useAnonymizationContext().isAnonymized;
}

export function AnonymizationProvider({ children }: PropsWithChildren): ReactElement {
    const isAnonymized = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // Aksel-portaler (Dialog, Popover, Tooltip) rendres i document.body, så klassen må ligge på <html>.
    // Simuleringsvinduet får den også, siden PopupWindow speiler klassene på <html>.
    useEffect(() => {
        document.documentElement.classList.toggle('anonymized', isAnonymized);
        return () => document.documentElement.classList.remove('anonymized');
    }, [isAnonymized]);

    const toggle = () => {
        localStorage.setItem(ANONYMISERING_KEY, String(!isAnonymized));
        window.dispatchEvent(new Event('storage'));
    };

    return <AnonymizationContext.Provider value={{ isAnonymized, toggle }}>{children}</AnonymizationContext.Provider>;
}

function subscribe(onStoreChange: () => void): () => void {
    window.addEventListener('storage', onStoreChange);
    return () => window.removeEventListener('storage', onStoreChange);
}

function getSnapshot(): boolean {
    return localStorage.getItem(ANONYMISERING_KEY) === 'true';
}

function getServerSnapshot(): boolean {
    return false;
}
