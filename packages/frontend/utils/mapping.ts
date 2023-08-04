import { GhostPeriode, Periode, Periodetilstand, Utbetalingtype } from '@io/graphql';
import { skalBehandleEnOgEnPeriode } from '@utils/featureToggles';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod, isUberegnetPeriode } from '@utils/typeguards';

const hasBeenAssessedAutomatically = (period: FetchedBeregnetPeriode): boolean =>
    period.utbetaling.vurdering?.automatisk ?? false;

const hasOppgave = (period: FetchedBeregnetPeriode): boolean => typeof period.oppgave?.id === 'string';

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

export const getUberegnetPeriodState = (period: UberegnetPeriode): PeriodState => {
    switch (period.periodetilstand) {
        case Periodetilstand.IngenUtbetaling:
            return 'ingenUtbetaling';
        case Periodetilstand.ManglerInformasjon:
            return 'venter';
        case Periodetilstand.ForberederGodkjenning:
        case Periodetilstand.VenterPaEnAnnenPeriode:
            return 'venterPåKiling';
        default:
            return 'ukjent';
    }
};

export const getPeriodState = (period?: Maybe<Periode | DatePeriod>): PeriodState => {
    if (isGhostPeriode(period)) return getGhostPeriodState(period);
    if (isInfotrygdPeriod(period)) return getInfotrygdPeriodState(period);
    if (isUberegnetPeriode(period)) return getUberegnetPeriodState(period);
    if (!isBeregnetPeriode(period)) return 'ukjent';

    switch (period.periodetilstand) {
        case Periodetilstand.ManglerInformasjon:
            return 'venter';
        case Periodetilstand.ForberederGodkjenning:
        case Periodetilstand.VenterPaEnAnnenPeriode:
            return 'venterPåKiling';
        case Periodetilstand.RevurderingFeilet:
            return 'revurderingFeilet';
        case Periodetilstand.UtbetalingFeilet:
            return 'utbetalingFeilet';
        case Periodetilstand.AnnulleringFeilet:
            return 'annulleringFeilet';
        case Periodetilstand.Annullert:
            return 'annullert';
        case Periodetilstand.TilAnnullering:
            return 'tilAnnullering';
        case Periodetilstand.IngenUtbetaling:
            switch (period.utbetaling.type) {
                case Utbetalingtype.Revurdering:
                    return 'revurdertIngenUtbetaling';
                case Utbetalingtype.Utbetaling:
                    return 'ingenUtbetaling';
                default:
                    return 'ukjent';
            }
        case Periodetilstand.TilGodkjenning:
            switch (period.utbetaling.type) {
                case Utbetalingtype.Revurdering:
                    if (skalBehandleEnOgEnPeriode && !hasOppgave(period)) return 'venter';
                    else return 'revurderes';
                case Utbetalingtype.Utbetaling:
                    return hasOppgave(period) ? 'tilGodkjenning' : 'venter';
                default:
                    return 'ukjent';
            }
        case Periodetilstand.TilUtbetaling:
            switch (period.utbetaling.type) {
                case Utbetalingtype.Utbetaling:
                    return hasBeenAssessedAutomatically(period) ? 'tilUtbetalingAutomatisk' : 'tilUtbetaling';
                case Utbetalingtype.Revurdering:
                    return 'revurdert';
                default:
                    return 'ukjent';
            }
        case Periodetilstand.UtbetaltVenterPaEnAnnenPeriode:
        case Periodetilstand.Utbetalt:
            switch (period.utbetaling.type) {
                case Utbetalingtype.Revurdering:
                    return 'revurdert';
                case Utbetalingtype.Utbetaling:
                    return hasBeenAssessedAutomatically(period) ? 'utbetaltAutomatisk' : 'utbetalt';
                default:
                    return 'ukjent';
            }
        case Periodetilstand.TilSkjonnsfastsettelse:
            return 'tilSkjønnsfastsettelse';
        default:
            return 'ukjent';
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
        case 'tilGodkjenning':
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
        case 'utbetalingFeilet':
            return 'Feilet';
        case 'revurderingFeilet':
            return 'Revurdering feilet';
        case 'tilInfotrygd':
            return 'Sendt til infotrygd';
        default:
            return 'Ukjent';
    }
};
