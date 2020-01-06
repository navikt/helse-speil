import React, { createContext, ReactChild, useState } from 'react';

interface ProviderProps {
    children: ReactChild | ReactChild[];
}

export const EasterEggContext = createContext({
    isActive: false,
    activate: () => {},
    deactivate: () => {}
});

export const EasterEggProvider = ({ children }: ProviderProps) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <EasterEggContext.Provider
            value={{
                isActive,
                activate: () => setIsActive(true),
                deactivate: () => setIsActive(false)
            }}
        >
            {children}
        </EasterEggContext.Provider>
    );
};
