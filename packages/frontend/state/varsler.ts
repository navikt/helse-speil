import { useEffect } from 'react';
import { atom, selector, useResetRecoilState, useSetRecoilState } from 'recoil';

import { Varseltype } from '@navikt/helse-frontend-varsel';

export const Scopes = {
    GLOBAL: undefined,
    OVERSIKT: '/',
    SAKSBILDE: '/*',
};

export interface VarselObject {
    key: string;
    type: Varseltype;
    message: string;
    scope?: string;
    technical?: string;
    ephemeral?: boolean;
}

export const varslerState = atom<VarselObject[]>({
    key: 'varslerState',
    default: [],
});

export const varselFilterState = atom<string | undefined>({
    key: 'varselFilter',
    default: Scopes.GLOBAL,
});

export const varslerForScope = selector({
    key: 'varslerForScope',
    get: ({ get }) => {
        // Må hente listen før filter, bug i recoil?
        const varsler = get(varslerState);
        const varselFilter = get(varselFilterState);
        return varsler.filter(({ scope }) => scope === Scopes.GLOBAL || scope === varselFilter);
    },
});

export const useVarselFilter = (scope?: string) => {
    const setVarselFilter = useSetRecoilState(varselFilterState);

    useEffect(() => {
        setVarselFilter(scope);
    }, []);
};

export const useAddVarsel = () => {
    const setVarsler = useSetRecoilState(varslerState);

    return (varsel: VarselObject) => {
        setVarsler((varsler) => [...varsler.filter((it) => it.key !== varsel.key), varsel]);
    };
};

export const useOperationErrorHandler = (operasjon: string) => {
    const varsel: VarselObject = {
        key: operasjon,
        type: Varseltype.Feil,
        message: `Det oppstod en feil. Handlingen som ikke ble utført: ${operasjon}`,
        scope: Scopes.GLOBAL,
    };

    const setVarsler = useSetRecoilState(varslerState);

    return (ex: Error) => {
        console.log(`Feil ved ${operasjon}. ${ex.message}`);
        setVarsler((varsler) => [...varsler.filter((it) => it.key !== varsel.key), varsel]);
    };
};

export const useRemoveVarsel = () => {
    const setVarsler = useSetRecoilState(varslerState);

    return (key: string) => {
        setVarsler((varsler) => varsler.filter((it) => it.key !== key));
    };
};

export const useAddEphemeralVarsel = () => {
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();

    return (varsel: VarselObject, timeToLiveMs: number) => {
        addVarsel({ ...varsel, ephemeral: true });
        setTimeout(() => removeVarsel(varsel.key), timeToLiveMs);
    };
};

export const useRemoveAlleVarsler = () => useResetRecoilState(varslerState);
