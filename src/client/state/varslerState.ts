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

const vaflerState = atom<Varsel[]>({
    key: 'vafler',
    default: [],
});

export const useVarsler = () => {
    const setVaflerState = useSetRecoilState(vaflerState);
    const leggTilVarsel = (varsel: Varsel) => setVaflerState((prev) => [...prev, varsel]);
    const fjernVarsler = () => setVaflerState([]);
    return {
        leggTilVarsel,
        fjernVarsler,
    };
};

export const varselFilterState = atom<string | undefined>({
    key: 'varselFilter',
    default: Scopes.GLOBAL,
});

export const varslerForScope = selector({
    key: 'varslerForScope',
    get: ({ get }) => {
        const varselFilter = get(varselFilterState);
        return get(vaflerState).filter((e) => e.scope === undefined || e.scope === varselFilter);
    },
});

export const useVarselFilter = (scope?: string) => {
    const setVarselFilter = useSetRecoilState(varselFilterState);

    useEffect(() => {
        setVarselFilter(scope);
    }, []);
};
