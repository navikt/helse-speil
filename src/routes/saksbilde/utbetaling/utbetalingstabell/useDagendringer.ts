import dayjs from 'dayjs';
import { Reducer, useCallback, useReducer } from 'react';

import { ApiGraderteAndreYtelserDag } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { tilEndringForDag } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endreDagerUtils';
import type { Dagendring } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/types';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { erReellEndring } from './erReellEndring';

export function useDagendringer() {
    const [state, dispatch] = useReducer(reducer, defaultDagerState);

    function markerDag(dag: Utbetalingstabelldag, markert: boolean) {
        dispatch({
            type: DagerActionType.TOGGLE_MARKERTE_DAGER,
            payload: { dag, toggle: markert, alleDager: new Map() },
        });
    }

    function markerDagerTil(dag: Utbetalingstabelldag, alleDager: Map<string, Utbetalingstabelldag>, markert: boolean) {
        dispatch({
            type: DagerActionType.SHIFT_TOGGLE_MARKERTE_DAGER,
            payload: { dag, alleDager, toggle: markert },
        });
    }

    function setMarkerteDager(dager: Map<string, Utbetalingstabelldag>) {
        dispatch({ type: DagerActionType.SET_MARKERTE_DAGER, payload: { dager } });
    }

    function overstyrMarkerteDager(endring: Dagendring, lagredeGraderteDager: ApiGraderteAndreYtelserDag[]) {
        dispatch({ type: DagerActionType.OVERSTYR_DAG, payload: { dag: endring, lagredeGraderteDager } });
    }

    function leggTilNyeDager(dager: Map<string, Utbetalingstabelldag>) {
        dispatch({ type: DagerActionType.LEGG_TIL_NYE_DAGER, payload: { dager } });
    }

    function slettSisteNyeDag() {
        dispatch({ type: DagerActionType.SLETT_SISTE_NYE_DAG });
    }

    // Stabil referanse fordi den brukes som avhengighet i en effekt, og Vitest kjører uten React Compiler
    const fjernNyeOgOverstyrteDager = useCallback(() => {
        dispatch({ type: DagerActionType.FJERN_NYE_OG_OVERSTYRTE_DAGER });
    }, []);

    function fjernAlleDager() {
        dispatch({ type: DagerActionType.FJERN_ALLE_DAGER });
    }

    return {
        ...state,
        markerDag,
        markerDagerTil,
        setMarkerteDager,
        overstyrMarkerteDager,
        leggTilNyeDager,
        slettSisteNyeDag,
        fjernNyeOgOverstyrteDager,
        fjernAlleDager,
    };
}

const getKey = (dag: Utbetalingstabelldag) => dag.dato;

enum DagerActionType {
    FJERN_ALLE_DAGER,
    LEGG_TIL_NYE_DAGER,
    OVERSTYR_DAG,
    SET_MARKERTE_DAGER,
    SLETT_SISTE_NYE_DAG,
    FJERN_NYE_OG_OVERSTYRTE_DAGER,
    SHIFT_TOGGLE_MARKERTE_DAGER,
    TOGGLE_MARKERTE_DAGER,
}

type FjernDagerAction = {
    type:
        | DagerActionType.FJERN_ALLE_DAGER
        | DagerActionType.SLETT_SISTE_NYE_DAG
        | DagerActionType.FJERN_NYE_OG_OVERSTYRTE_DAGER;
};

type ModifyDagAction = {
    type: DagerActionType.OVERSTYR_DAG;
    payload: {
        dag: Dagendring;
        lagredeGraderteDager: ApiGraderteAndreYtelserDag[];
    };
};

type ModifyDagerAction = {
    type: DagerActionType.LEGG_TIL_NYE_DAGER | DagerActionType.SET_MARKERTE_DAGER;
    payload: {
        dager: Map<string, Utbetalingstabelldag>;
    };
};

type ToggleMarkerteDagerAction = {
    type: DagerActionType.SHIFT_TOGGLE_MARKERTE_DAGER | DagerActionType.TOGGLE_MARKERTE_DAGER;
    payload: {
        dag: Utbetalingstabelldag;
        alleDager: Map<string, Utbetalingstabelldag>;
        toggle: boolean;
    };
};

type DagerAction = FjernDagerAction | ModifyDagAction | ModifyDagerAction | ToggleMarkerteDagerAction;

interface DagerState {
    markerteDager: Map<string, Utbetalingstabelldag>;
    overstyrteDager: Map<string, Utbetalingstabelldag>;
    nyeDager: Map<string, Utbetalingstabelldag>;
}

const defaultDagerState: DagerState = {
    markerteDager: new Map(),
    overstyrteDager: new Map(),
    nyeDager: new Map(),
};

const reducer: Reducer<DagerState, DagerAction> = (prevState, action) => {
    const overstyrDag = (endring: Dagendring, lagredeGraderteDager: ApiGraderteAndreYtelserDag[]) => {
        const nyeOverstyrteDager = Array.from(prevState.markerteDager.values()).reduce(
            (map: Map<string, Utbetalingstabelldag>, fraDag: Utbetalingstabelldag) => {
                const lagretGradertDag = lagredeGraderteDager.find((it) => it.dato === fraDag.dato);
                const tilDag = tilEndringForDag(endring, fraDag);
                if (erReellEndring(tilDag, fraDag, lagretGradertDag)) {
                    map.set(getKey(fraDag), { ...fraDag, ...tilDag, fraType: fraDag.dag.speilDagtype });
                } else {
                    map.delete(getKey(fraDag));
                }
                return map;
            },
            new Map(prevState.overstyrteDager),
        );
        return {
            ...prevState,
            markerteDager: new Map(),
            overstyrteDager: nyeOverstyrteDager,
        };
    };

    const toggleMarkerteDager = (dag: Utbetalingstabelldag, toggle: boolean) => {
        const nyeMarkerteDager = new Map(prevState.markerteDager);
        if (toggle) {
            nyeMarkerteDager.set(getKey(dag), dag);
        } else {
            nyeMarkerteDager.delete(getKey(dag));
        }
        return {
            ...prevState,
            markerteDager: nyeMarkerteDager,
        };
    };

    const shiftToggleMarkerteDager = (
        dag: Utbetalingstabelldag,
        alleDager: Map<string, Utbetalingstabelldag>,
        toggle: boolean,
    ) => {
        const forrigeValgteDag = Array.from(prevState.markerteDager.values())?.pop() ?? dag;
        const nyeMarkerteDager = new Map(prevState.markerteDager);
        Array.from(alleDager.values())
            .filter((it) => dayjs(it.dato).isBetween(forrigeValgteDag.dato, dag.dato, 'day', '[]'))
            .forEach((it) => {
                if (toggle) {
                    nyeMarkerteDager.set(getKey(it), it);
                } else {
                    nyeMarkerteDager.delete(getKey(it));
                }
            });
        return {
            ...prevState,
            markerteDager: nyeMarkerteDager,
        };
    };

    switch (action.type) {
        case DagerActionType.OVERSTYR_DAG:
            return overstyrDag(action.payload.dag, action.payload.lagredeGraderteDager);
        case DagerActionType.TOGGLE_MARKERTE_DAGER:
            return toggleMarkerteDager(action.payload.dag, action.payload.toggle);
        case DagerActionType.SHIFT_TOGGLE_MARKERTE_DAGER:
            return shiftToggleMarkerteDager(action.payload.dag, action.payload.alleDager, action.payload.toggle);
        case DagerActionType.SET_MARKERTE_DAGER:
            return {
                ...prevState,
                markerteDager: action.payload.dager,
            };
        case DagerActionType.FJERN_NYE_OG_OVERSTYRTE_DAGER:
            return {
                ...prevState,
                overstyrteDager: new Map(),
                nyeDager: new Map(),
            };
        case DagerActionType.SLETT_SISTE_NYE_DAG:
            return {
                ...prevState,
                nyeDager: new Map(Array.from(prevState.nyeDager).slice(1)),
            };
        case DagerActionType.FJERN_ALLE_DAGER:
            return defaultDagerState;
        case DagerActionType.LEGG_TIL_NYE_DAGER:
            return {
                ...prevState,
                nyeDager: new Map([...action.payload.dager, ...prevState.nyeDager]),
            };
    }
};
