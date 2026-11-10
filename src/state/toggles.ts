import type { WritableAtom } from 'jotai';
import { useAtom, useAtomValue } from 'jotai';
import type { SetStateAction } from 'react';

import { erUtvikling } from '@/env';
import { atomWithLocalStorage, atomWithSessionStorage } from '@state/jotai';

export type ToggleState = {
    kanBeslutteEgne: boolean;
    nyMedlemskapsvisning: boolean;
    kanVurdereOppholdskrav: boolean;
    utviklersnacks: boolean;
};

type SessionToggleState = Omit<ToggleState, 'utviklersnacks'>;

const defaultToggleState: SessionToggleState = {
    kanBeslutteEgne: false,
    nyMedlemskapsvisning: false,
    kanVurdereOppholdskrav: false,
};

const toggleState = atomWithSessionStorage<SessionToggleState>('toggleState', defaultToggleState);

const utviklersnacksState = atomWithLocalStorage<boolean>('utviklersnacks', false);

export function hydrateToggleState(): [
    WritableAtom<SessionToggleState, [SetStateAction<SessionToggleState>], void>,
    SessionToggleState,
] {
    const sessionStorageState = sessionStorage.getItem('toggleState');

    return [
        toggleState,
        sessionStorageState && erUtvikling
            ? { ...defaultToggleState, ...JSON.parse(sessionStorageState) }
            : { ...defaultToggleState },
    ];
}

export const useToggle = (): { value: ToggleState; toggle: (property: keyof ToggleState) => () => void } => {
    const [toggleStateValue, setToggleState] = useAtom(toggleState);
    const [utviklersnacks, setUtviklersnacks] = useAtom(utviklersnacksState);

    return {
        value: { ...toggleStateValue, utviklersnacks },
        toggle: (property: keyof ToggleState) => () => {
            if (property === 'utviklersnacks') {
                setUtviklersnacks((prev) => !prev);
                return;
            }
            setToggleState((prevState) => ({
                ...prevState,
                [property]: !prevState[property],
            }));
        },
    };
};

export const useKanBeslutteEgneOppgaver = (): boolean => useAtomValue(toggleState).kanBeslutteEgne;

// I prod kan bare utviklere skru på visningen, fra toggle-menyen
export const useNyMedlemskapsvisning = (): boolean => useAtomValue(toggleState).nyMedlemskapsvisning;

// sp-medlemskap avviser overstyring i prod til den gjør vurderingen selv (steg 7 i innfasingen av vurderings-id)
export function useKanOverstyreMedlemskap(): boolean {
    return erUtvikling;
}

// Bare i dev til skissene for § 8-9 er klare og sp-avslagsdager er i drift i prod (navikt/sas-issues#98)
export const useKanVurdereOppholdskrav = (): boolean => useAtomValue(toggleState).kanVurdereOppholdskrav && erUtvikling;

export const useUtviklersnacks = (): boolean => useAtomValue(utviklersnacksState);
