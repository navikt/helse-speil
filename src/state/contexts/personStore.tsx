import { createStore } from 'jotai';
import { createContext, useContext } from 'react';

type JotaiStore = ReturnType<typeof createStore>;
export const PersonStoreContext = createContext<JotaiStore | null>(null);

export const usePersonStore = (): JotaiStore => {
    const context = useContext(PersonStoreContext);
    if (!context)
        throw new Error(
            'Mangler PersonStoreContext - antageligvis brukes usePersonStore()' +
                ' et sted som ikke ligger under PersonStoreContext.Provider i komponenttreet',
        );
    return context;
};

PersonStoreContext.displayName = 'PersonStoreContext';
