/// <reference types="vite/client" />

declare module '*.png' {
    const value: any;
}

declare module '*.svg' {
    const value: any;
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

declare type PeriodCategory = 'attention' | 'success' | 'error' | 'old' | 'legacy' | 'blank';

declare type PeriodState =
    | 'tilUtbetaling'
    | 'utbetalt'
    | 'oppgaver'
    | 'venter'
    | 'venterPåKiling'
    | 'avslag'
    | 'ingenUtbetaling'
    | 'kunFerie'
    | 'kunPermisjon'
    | 'feilet'
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
