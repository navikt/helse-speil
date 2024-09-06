import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    NyttInntektsforholdPeriodeFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';

export type DateString = string;

export type DatePeriod = {
    fom: string;
    tom: string;
};

export type InfotrygdPeriod = DatePeriod & {
    grad: string;
    dagsats: number;
    typetekst: string;
};

export type PeriodState =
    | 'tilUtbetaling'
    | 'utbetalt'
    | 'tilGodkjenning'
    | 'venter'
    | 'venterPåKiling'
    | 'avslag'
    | 'ingenUtbetaling'
    | 'forkastetIngenUtbetaling'
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
    | 'infotrygdUkjent'
    | 'tilSkjønnsfastsettelse'
    | 'tilkommenInntekt';

export type ActivePeriod =
    | BeregnetPeriodeFragment
    | UberegnetPeriodeFragment
    | GhostPeriodeFragment
    | NyttInntektsforholdPeriodeFragment;

export type ArbeidsgiverGenerasjon = ArbeidsgiverFragment['generasjoner'][0];

export type OverridableConstructor<T, E = object> = (overrides?: Partial<T>) => T & E;
