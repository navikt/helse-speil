import { createStore } from 'jotai/index';
import { createContext, useContext } from 'react';

import { Maybe } from '@io/graphql';

type JotaiStore = ReturnType<typeof createStore>;
export const PersonStoreContext = createContext<Maybe<JotaiStore>>(null);

export const usePersonStore = (): JotaiStore => {
    const context = useContext(PersonStoreContext);
    if (!context)
        throw new Error(
            'Mangler PersonStoreContext - antageligvis brukes usePersonStore()' +
                ' et sted som ikke ligger under PersonStoreContext.Provider i komponenttreet',
        );
    return context;
};
