import type { BeregnetPeriode, GhostPeriode, Periode, UberegnetPeriode } from '@io/graphql';
import { Sykdomsdagtype, Utbetalingsdagtype } from '@io/graphql';

const hasOppgave = (period: BeregnetPeriode): boolean => typeof period.oppgavereferanse === 'string';

const hasBeenAssessedAutomatically = (period: BeregnetPeriode): boolean =>
    period.utbetaling.vurdering?.automatisk ?? false;

const consistsOfOnly = (period: BeregnetPeriode, ...dayTypes: Sykdomsdagtype[]): boolean =>
    period.tidslinje.every(
        (dag) => dag.utbetalingsdagtype === Utbetalingsdagtype.Helgedag || dayTypes.includes(dag.sykdomsdagtype)
    );

const hasAtLeastOne = (period: BeregnetPeriode, dayType: Utbetalingsdagtype): boolean =>
    period.tidslinje.some((dag) => dag.utbetalingsdagtype === dayType);

const getDefaultPeriodState = (period: BeregnetPeriode): PeriodState => {
    switch (period.utbetaling.status) {
        case 'GodkjentUtenUtbetaling':
            return consistsOfOnly(period, Sykdomsdagtype.Feriedag)
                ? 'kunFerie'
                : consistsOfOnly(period, Sykdomsdagtype.Permisjonsdag)
                ? 'kunPermisjon'
                : 'ingenUtbetaling';
        case 'UtbetalingFeilet':
            return 'feilet';
        default:
            return 'ukjent';
    }
};

export const isInfotrygdPeriod = (period: Periode | DatePeriod): period is InfotrygdPeriod =>
    (period as InfotrygdPeriod)?.typetekst !== undefined && (period as InfotrygdPeriod)?.typetekst !== null;

export const isBeregnetPeriode = (period: Periode | DatePeriod): period is BeregnetPeriode =>
    (period as BeregnetPeriode)?.beregningId !== undefined && (period as BeregnetPeriode)?.beregningId !== null;

export const isGhostPeriode = (period: GhostPeriode | DatePeriod): period is GhostPeriode =>
    typeof (period as any).deaktivert === 'boolean';

export const isUberegnetPeriode = (period: Periode | DatePeriod): period is UberegnetPeriode =>
    !isBeregnetPeriode(period) && !isInfotrygdPeriod(period) && !isGhostPeriode(period);

const getInfotrygdPeriodState = (period: InfotrygdPeriod): PeriodState => {
    switch (period.typetekst) {
        case 'Utbetaling':
        case 'ArbRef':
            return 'infotrygdUtbetalt';
        case 'Ferie':
            return 'infotrygdFerie';
        default:
            return 'infotrygdUkjent';
    }
};
const getGhostPeriodState = (period: GhostPeriode): PeriodState => {
    return period.deaktivert ? 'utenSykefraværDeaktivert' : 'utenSykefravær';
};

export const getPeriodState = (period: Periode | DatePeriod): PeriodState => {
    if (isGhostPeriode(period)) return getGhostPeriodState(period);
    if (isInfotrygdPeriod(period)) return getInfotrygdPeriodState(period);
    if (!isBeregnetPeriode(period)) return 'venter';

    switch (period.utbetaling.type) {
        case 'UTBETALING': {
            switch (period.utbetaling.status) {
                case 'Ubetalt':
                    return hasOppgave(period) ? 'oppgaver' : 'venter';
                case 'IkkeGodkjent':
                    return 'avslag';
                case 'Godkjent':
                case 'Sendt':
                case 'Overført':
                    return hasBeenAssessedAutomatically(period) ? 'tilUtbetalingAutomatisk' : 'tilUtbetaling';
                case 'Utbetalt':
                    return hasBeenAssessedAutomatically(period) ? 'utbetaltAutomatisk' : 'utbetalt';
                default:
                    return getDefaultPeriodState(period);
            }
        }
        case 'REVURDERING': {
            switch (period.utbetaling.status) {
                case 'Ubetalt':
                    return 'revurderes';
                case 'IkkeGodkjent':
                    return 'avslag';
                case 'Godkjent':
                case 'Sendt':
                case 'Overført':
                case 'Utbetalt':
                case 'GodkjentUtenUtbetaling':
                    return hasAtLeastOne(period, Utbetalingsdagtype.Navdag) ? 'revurdert' : 'revurdertIngenUtbetaling';
                case 'UtbetalingFeilet':
                    return 'revurderingFeilet';
                default:
                    return getDefaultPeriodState(period);
            }
        }
        case 'ANNULLERING': {
            switch (period.utbetaling.status) {
                case 'Godkjent':
                case 'Sendt':
                case 'Overført':
                    return 'tilAnnullering';
                case 'Annullert':
                    return 'annullert';
                case 'UtbetalingFeilet':
                    return 'annulleringFeilet';
                default:
                    return getDefaultPeriodState(period);
            }
        }
        default: {
            return 'ukjent';
        }
    }
};

export const getPeriodCategory = (periodState: PeriodState): PeriodCategory | null => {
    switch (periodState) {
        case 'tilUtbetaling':
        case 'utbetalt':
        case 'revurdert':
        case 'utbetaltAutomatisk':
        case 'tilUtbetalingAutomatisk':
            return 'success';
        case 'oppgaver':
        case 'revurderes':
            return 'attention';
        case 'feilet':
        case 'avslag':
        case 'annullert':
        case 'tilAnnullering':
        case 'revurderingFeilet':
        case 'annulleringFeilet':
            return 'error';
        case 'utenSykefravær':
        case 'utenSykefraværDeaktivert':
            return 'blank';
        case 'infotrygdUtbetalt':
        case 'infotrygdFerie':
        case 'infotrygdUkjent':
            return 'legacy';
        case 'ukjent':
        case 'venter':
        case 'kunFerie':
        case 'kunPermisjon':
        case 'tilInfotrygd':
        case 'venterPåKiling':
        case 'ingenUtbetaling':
        case 'revurdertIngenUtbetaling':
        default:
            return null;
    }
};

export const getPeriodStateText = (state: PeriodState): string => {
    switch (state) {
        case 'utbetaltAutomatisk':
            return 'Automatisk utbetalt';
        case 'tilUtbetalingAutomatisk':
            return 'Sendt til automatisk utbetaling';
        case 'revurderes':
            return 'Til revurdering';
        case 'oppgaver':
            return 'Til behandling';
        case 'tilUtbetaling':
            return 'Sendt til utbetaling';
        case 'revurdert':
        case 'utbetalt':
            return 'Utbetalt';
        case 'revurdertIngenUtbetaling':
        case 'ingenUtbetaling':
            return 'Ingen utbetaling';
        case 'kunFerie':
            return 'Ferie';
        case 'kunPermisjon':
            return 'Permisjon';
        case 'venter':
        case 'venterPåKiling':
            return 'Venter';
        case 'annullert':
            return 'Annullert';
        case 'annulleringFeilet':
            return 'Annullering feilet';
        case 'tilAnnullering':
            return 'Sendt til annullering';
        case 'avslag':
            return 'Avslag';
        case 'feilet':
            return 'Feilet';
        case 'revurderingFeilet':
            return 'Revurdering feilet';
        case 'tilInfotrygd':
            return 'Sendt til infotrygd';
        default:
            return 'Ukjent';
    }
};
