import { Behandlingsstatistikk } from '@io/graphql';
import { useEffect, useReducer } from 'react';
import { fetchBehandlingsstatistikk } from '@io/graphql/fetchBehandlingsstatistikk';

type ReducerStateBase<T> = {
    isLoading: boolean;
    value?: T;
    error?: Error;
};

type ReducerStateInitial<T> = ReducerStateBase<T> & {
    isLoading: false;
    value: undefined;
    error: undefined;
};

type ReducerStateError<T> = ReducerStateBase<T> & {
    isLoading: false;
    error: Error;
};

type ReducerStateSuccess<T> = ReducerStateBase<T> & {
    isLoading: false;
    value: T;
};

type ReducerStateLoading<T> = ReducerStateBase<T> & {
    isLoading: true;
};

type ReducerState<T> =
    | ReducerStateBase<T>
    | ReducerStateInitial<T>
    | ReducerStateSuccess<T>
    | ReducerStateError<T>
    | ReducerStateLoading<T>;

type UpdateValue<T> = {
    type: 'UpdateValue';
    payload: T;
};

type SetIsLoading = {
    type: 'SetIsLoading';
};

type SetError = {
    type: 'SetError';
    payload: Error;
};

type ReducerAction<T> = UpdateValue<T> | SetIsLoading | SetError;

const reducer = (state: ReducerState<Behandlingsstatistikk>, action: ReducerAction<Behandlingsstatistikk>) => {
    switch (action.type) {
        case 'SetError': {
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        }
        case 'SetIsLoading': {
            return {
                ...state,
                isLoading: true,
            };
        }
        case 'UpdateValue': {
            return {
                ...state,
                isLoading: false,
                error: undefined,
                value: action.payload,
            };
        }
    }
};

export const useBehandlingsstatistikk = (): ReducerState<Behandlingsstatistikk> => {
    const [state, dispatch] = useReducer(reducer, { isLoading: false });

    useEffect(() => {
        dispatch({ type: 'SetIsLoading' });
        fetchBehandlingsstatistikk()
            .then(({ behandlingsstatistikk }) => {
                dispatch({ type: 'UpdateValue', payload: behandlingsstatistikk });
            })
            .catch((error) => {
                dispatch({ type: 'SetError', payload: error });
            });
    }, []);

    return state;
};
