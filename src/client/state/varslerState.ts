import { atom, useSetRecoilState, selector } from 'recoil';
import { useEffect } from 'react';
import { Varseltype } from '@navikt/helse-frontend-varsel';

export const Scopes = {
    GLOBAL: undefined,
    OVERSIKT: '/',
    SAKSBILDE: '/*',
};

export interface Varsel {
    message: string;
    technical?: string;
    scope?: string;
    type: Varseltype;
}

const varslerState = atom<Varsel[]>({
    key: 'varsler',
    default: [],
});

export const varselFilterState = atom<string | undefined>({
    key: 'varselFilter',
    default: Scopes.GLOBAL,
});

export const varslerForScope = selector({
    key: 'varslerForScope',
    get: ({ get }) => {
        const varselFilter = get(varselFilterState);
        return get(varslerState).filter((e) => e.scope === undefined || e.scope === varselFilter);
    },
});

export const useVarselFilter = (scope?: string) => {
    const setVarselFilter = useSetRecoilState(varselFilterState);

    useEffect(() => {
        setVarselFilter(scope);
    }, []);
};

export const useUpdateVarsler = () => {
    const setVarslerState = useSetRecoilState(varslerState);
    return {
        leggTilVarsel: (varsel: Varsel) => setVarslerState((prev) => [...prev, varsel]),
        fjernVarsler: () => setVarslerState([]),
    };
};
