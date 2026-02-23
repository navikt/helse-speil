import { BeregnetPeriodeFragment, GhostPeriodeFragment, UberegnetPeriodeFragment } from '@io/graphql';

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
    | 'venterPåInntektsopplysninger'
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
    | 'avventerAnnullering';

export type PeriodCategory =
    | 'success'
    | 'error'
    | 'attention'
    | 'waiting'
    | 'neutral'
    | 'neutralError'
    | 'tilkommen'
    | 'tilkommen_fjernet'
    | 'ghost'
    | 'ghostDeaktivert'
    | 'historisk'
    | 'ukjent';

export const getPeriodCategory = (periodState: PeriodState): PeriodCategory => {
    switch (periodState) {
        case 'utbetaltAutomatisk':
        case 'revurdert':
        case 'infotrygdUtbetalt':
        case 'utbetalt': {
            return 'success';
        }
        case 'revurderingFeilet':
        case 'utbetalingFeilet':
        case 'tilInfotrygd':
        case 'annullert':
        case 'annulleringFeilet':
        case 'avslag': {
            return 'error';
        }
        case 'revurderes':
        case 'tilGodkjenning':
        case 'tilSkjønnsfastsettelse': {
            return 'attention';
        }
        case 'venter':
        case 'venterPåInntektsopplysninger':
        case 'venterPåKiling':
        case 'tilAnnullering':
        case 'tilUtbetalingAutomatisk':
        case 'tilUtbetaling':
        case 'avventerAnnullering': {
            return 'waiting';
        }
        case 'infotrygdFerie':
        case 'utenSykefravær':
        case 'utenSykefraværDeaktivert':
        case 'revurdertIngenUtbetaling':
        case 'ingenUtbetaling':
        case 'kunPermisjon':
        case 'kunFerie':
            return 'neutral';
        case 'forkastetIngenUtbetaling':
            return 'neutralError';
        case 'infotrygdUkjent':
        case 'ukjent':
        default: {
            return 'ukjent';
        }
    }
};

export type ActivePeriod = BeregnetPeriodeFragment | UberegnetPeriodeFragment | GhostPeriodeFragment;

export type OverridableConstructor<T, E = object> = (overrides?: Partial<T>) => T & E;
