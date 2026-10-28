import {
    ApiBeregnetPeriode,
    ApiGhostPeriode,
    ApiPeriode,
    ApiPeriodetilstand,
    ApiUberegnetPeriode,
    ApiUtbetalingtype,
} from '@io/rest/generated/spesialist.schemas';
import { DatePeriod, InfotrygdPeriod, PeriodState } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod, isUberegnetPeriode } from '@utils/typeguards';

const hasBeenAssessedAutomatically = (period: ApiBeregnetPeriode): boolean =>
    period.utbetaling.vurdering?.automatisk ?? false;

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

const getGhostPeriodState = (period: ApiGhostPeriode): PeriodState => {
    return period.deaktivert ? 'utenSykefraværDeaktivert' : 'utenSykefravær';
};

export const getUberegnetPeriodState = (period: ApiUberegnetPeriode): PeriodState => {
    switch (period.periodetilstand) {
        case ApiPeriodetilstand.IngenUtbetaling:
            return 'ingenUtbetaling';
        case ApiPeriodetilstand.AvventerInntektsopplysninger:
            return 'venterPåInntektsopplysninger';
        case ApiPeriodetilstand.ManglerInformasjon:
            return 'venter';
        case ApiPeriodetilstand.ForberederGodkjenning:
        case ApiPeriodetilstand.VenterPaEnAnnenPeriode:
        case ApiPeriodetilstand.UtbetaltVenterPaEnAnnenPeriode:
            return 'venterPåKiling';
        case ApiPeriodetilstand.Annullert:
            return 'forkastetIngenUtbetaling';
        case ApiPeriodetilstand.AvventerAnnullering:
            return 'avventerAnnullering';
        default:
            return 'ukjent';
    }
};

// En periode til godkjenning uten aktiv oppgave (f.eks. før Spesialist har opprettet den) vises som 'venter'
export const getPeriodStateMedOppgave = (
    period: ApiPeriode | DatePeriod | null | undefined,
    harAktivOppgave: boolean,
): PeriodState => {
    const state = getPeriodState(period);
    return state === 'tilGodkjenning' && !harAktivOppgave ? 'venter' : state;
};

export const getPeriodState = (period: ApiPeriode | DatePeriod | null | undefined): PeriodState => {
    if (!period) return 'ukjent';
    if (isGhostPeriode(period)) return getGhostPeriodState(period);
    if (isInfotrygdPeriod(period)) return getInfotrygdPeriodState(period);
    if (isUberegnetPeriode(period)) return getUberegnetPeriodState(period);
    if (!isBeregnetPeriode(period)) return 'ukjent';

    switch (period.periodetilstand) {
        case ApiPeriodetilstand.AvventerInntektsopplysninger:
            return 'venterPåInntektsopplysninger';
        case ApiPeriodetilstand.ManglerInformasjon:
            return 'venter';
        case ApiPeriodetilstand.ForberederGodkjenning:
        case ApiPeriodetilstand.VenterPaEnAnnenPeriode:
        case ApiPeriodetilstand.UtbetaltVenterPaEnAnnenPeriode:
            return 'venterPåKiling';
        case ApiPeriodetilstand.RevurderingFeilet:
            return 'revurderingFeilet';
        case ApiPeriodetilstand.UtbetalingFeilet:
            return 'utbetalingFeilet';
        case ApiPeriodetilstand.AnnulleringFeilet:
            return 'annulleringFeilet';
        case ApiPeriodetilstand.Annullert:
            return 'annullert';
        case ApiPeriodetilstand.TilAnnullering:
            return 'tilAnnullering';
        case ApiPeriodetilstand.IngenUtbetaling:
            switch (period.utbetaling.type) {
                case ApiUtbetalingtype.REVURDERING:
                    return 'revurdertIngenUtbetaling';
                case ApiUtbetalingtype.UTBETALING:
                    return 'ingenUtbetaling';
                default:
                    return 'ukjent';
            }
        case ApiPeriodetilstand.TilGodkjenning:
            switch (period.utbetaling.type) {
                case ApiUtbetalingtype.REVURDERING:
                    return 'revurderes';
                case ApiUtbetalingtype.UTBETALING:
                    return 'tilGodkjenning';
                default:
                    return 'ukjent';
            }
        case ApiPeriodetilstand.TilUtbetaling:
            switch (period.utbetaling.type) {
                case ApiUtbetalingtype.UTBETALING:
                    return hasBeenAssessedAutomatically(period) ? 'tilUtbetalingAutomatisk' : 'tilUtbetaling';
                case ApiUtbetalingtype.REVURDERING:
                    return 'revurdert';
                default:
                    return 'ukjent';
            }
        case ApiPeriodetilstand.Utbetalt:
            switch (period.utbetaling.type) {
                case ApiUtbetalingtype.REVURDERING:
                    return 'revurdert';
                case ApiUtbetalingtype.UTBETALING:
                    return hasBeenAssessedAutomatically(period) ? 'utbetaltAutomatisk' : 'utbetalt';
                default:
                    return 'ukjent';
            }
        case ApiPeriodetilstand.TilSkjonnsfastsettelse:
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
        case 'forkastetIngenUtbetaling':
            return 'Forkastet, tatt ut av speil';
        case 'kunFerie':
            return 'Ferie';
        case 'kunPermisjon':
            return 'Permisjon';
        case 'venterPåInntektsopplysninger':
            return 'Venter på inntektsopplysninger';
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
        case 'tilSkjønnsfastsettelse':
            return 'Til skjønnsfastsettelse';
        case 'avventerAnnullering':
            return 'Avventer annullering';
        default:
            return 'Ukjent';
    }
};
