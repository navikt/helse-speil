'use client';

import { PropsWithChildren, ReactElement, createContext, useContext, useSyncExternalStore } from 'react';

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

    const toggle = () => {
        localStorage.setItem(ANONYMISERING_KEY, String(!isAnonymized));
        window.dispatchEvent(new Event('storage'));
    };

    return <AnonymizationContext.Provider value={{ isAnonymized, toggle }}>{children}</AnonymizationContext.Provider>;
}

// Holder klassen som CSS-en henger på. div#root har også layout-CSS-en for hele appen, se globals.css.
// Ligger utenfor provideren så tester kan bruke konteksten uten å få med seg markup.
export function AnonymizationRoot({ children }: PropsWithChildren): ReactElement {
    const { isAnonymized } = useAnonymizationContext();

    return (
        <div id="root" className={isAnonymized ? 'anonymized' : undefined}>
            {children}
        </div>
    );
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
