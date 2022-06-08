import {
    Adressebeskyttelse,
    BeregnetPeriode,
    GhostPeriode,
    Kjonn,
    Periode,
    Periodetilstand,
    Personinfo as GraphQLPersoninfo,
    Utbetalingtype,
} from '@io/graphql';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod, isUberegnetPeriode } from '@utils/typeguards';
import { ISO_DATOFORMAT } from '@utils/date';

const hasBeenAssessedAutomatically = (period: BeregnetPeriode): boolean =>
    period.utbetaling.vurdering?.automatisk ?? false;

const hasOppgave = (period: BeregnetPeriode): boolean => typeof period.oppgavereferanse === 'string';

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
                    return 'revurderes';
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
        case Periodetilstand.Utbetalt:
            switch (period.utbetaling.type) {
                case Utbetalingtype.Revurdering:
                    return 'revurdert';
                case Utbetalingtype.Utbetaling:
                    return hasBeenAssessedAutomatically(period) ? 'utbetaltAutomatisk' : 'utbetalt';
                default:
                    return 'ukjent';
            }
        default:
            return 'ukjent';
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
        case 'tilGodkjenning':
        case 'revurderes':
        case 'revurderingFeilet':
            return 'attention';
        case 'utbetalingFeilet':
        case 'avslag':
        case 'annullert':
        case 'tilAnnullering':
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

export const convertToGraphQLPersoninfo = (personinfo: Personinfo): GraphQLPersoninfo => {
    return {
        adressebeskyttelse: Adressebeskyttelse[personinfo.adressebeskyttelse],
        etternavn: personinfo.etternavn,
        fornavn: personinfo.fornavn,
        mellomnavn: personinfo.mellomnavn,
        kjonn: personinfo.kjønn === 'mann' ? Kjonn.Mann : personinfo.kjønn === 'kvinne' ? Kjonn.Kvinne : Kjonn.Ukjent,
        fodselsdato: personinfo.fødselsdato?.format(ISO_DATOFORMAT),
    };
};
