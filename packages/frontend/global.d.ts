/// <reference types="vite/client" />
type FetchPersonQuery = import('@io/graphql').FetchPersonQuery;
type SpeilError = import('@utils/error').SpeilError;

declare module '*.png' {
    const value: unknown;
}

declare module '*.svg' {
    const value: unknown;
}

declare type DateString = string;

declare type DatePeriod = {
    fom: string;
    tom: string;
};

declare type InfotrygdPeriod = DatePeriod & {
    grad: string;
    dagsats: number;
    typetekst: string;
};

declare type ChildrenProps = {
    children?: React.ReactNode;
};

declare type PeriodState =
    | 'tilUtbetaling'
    | 'utbetalt'
    | 'tilGodkjenning'
    | 'venter'
    | 'venterPåKiling'
    | 'avslag'
    | 'ingenUtbetaling'
    | 'kunFerie'
    | 'kunPermisjon'
    | 'utbetalingFeilet'
    | 'revurderingFeilet'
    | 'ukjent'
    | 'tilInfotrygd'
    | 'annullert'
    | 'tilAnnullering'
    | 'annulleringFeilet'
    | 'utbetaltAutomatisk'
    | 'tilUtbetalingAutomatisk'
    | 'revurderes'
    | 'revurdert'
    | 'revurdertIngenUtbetaling'
    | 'utenSykefravær'
    | 'utenSykefraværDeaktivert'
    | 'infotrygdUtbetalt'
    | 'infotrygdFerie'
    | 'infotrygdUkjent';

declare type DataAttributeKey = `data-${string}`;

declare type HTMLAttributes<T> = React.HTMLAttributes<T> & {
    [dataAttribute: DataAttributeKey]: string | number | boolean;
};

declare type FetchedDataLoading<T> = {
    state: 'isLoading';
    data?: T;
    error?: SpeilError;
};

declare type FetchedDataSuccess<T> = {
    state: 'hasValue';
    data: T;
    error?: SpeilError;
};

declare type FetchedDataError<T> = {
    state: 'hasError';
    data?: T;
    error: SpeilError;
};

declare type FetchedData<T> =
    | {
          state: 'initial';
          data?: T;
          error?: SpeilError;
      }
    | FetchedDataError<T>
    | FetchedDataLoading<T>
    | FetchedDataSuccess<T>;

declare type FetchedPerson = NonNullable<FetchPersonQuery['person']>;

declare type FetchedBeregnetPeriode = Omit<BeregnetPeriode, 'oppgavereferanse'>;

declare type ActivePeriod = FetchedBeregnetPeriode | UberegnetPeriode | GhostPeriode;

type OverridableConstructor<T, E = object> = (overrides?: Partial<T>) => T & E;
