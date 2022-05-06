import {
    Adressebeskyttelse,
    Behandlingstype,
    BeregnetPeriode,
    GhostPeriode,
    Kjonn,
    Periode,
    Periodetilstand,
    Personinfo as GraphQLPersoninfo,
    Sykdomsdagtype,
    Utbetalingsdagtype,
    Utbetalingstatus,
    Utbetalingtype,
} from '@io/graphql';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod, isUberegnetPeriode } from '@utils/typeguards';
import { ISO_DATOFORMAT } from '@utils/date';

const hasOppgave = (period: BeregnetPeriode): boolean => typeof period.oppgavereferanse === 'string';

const hasBeenAssessedAutomatically = (period: BeregnetPeriode): boolean =>
    period.utbetaling.vurdering?.automatisk ?? false;

const consistsOfOnly = (period: BeregnetPeriode, ...dayTypes: Sykdomsdagtype[]): boolean =>
    period.tidslinje.every(
        (dag) => dag.utbetalingsdagtype === Utbetalingsdagtype.Helgedag || dayTypes.includes(dag.sykdomsdagtype),
    );

const hasAtLeastOne = (period: BeregnetPeriode, dayType: Utbetalingsdagtype): boolean =>
    period.tidslinje.some((dag) => dag.utbetalingsdagtype === dayType);

const getDefaultPeriodState = (period: BeregnetPeriode): PeriodState => {
    switch (period.utbetaling.status) {
        case Utbetalingstatus.Godkjentutenutbetaling:
            return consistsOfOnly(period, Sykdomsdagtype.Feriedag)
                ? 'kunFerie'
                : consistsOfOnly(period, Sykdomsdagtype.Permisjonsdag)
                ? 'kunPermisjon'
                : 'ingenUtbetaling';
        case Utbetalingstatus.Utbetalingfeilet:
            return 'feilet';
        default:
            return 'ukjent';
    }
};

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

const getUberegnetPeriodState = (period: UberegnetPeriode): PeriodState => {
    switch (period.behandlingstype) {
        case Behandlingstype.Uberegnet: {
            if (period.tidslinje.every((it) => !it.utbetalingsinfo)) {
                return 'ingenUtbetaling';
            } else {
                return 'ukjent';
            }
        }
        case Behandlingstype.Venter:
        default:
            return 'venter';
    }
};

export const getPeriodState = (period?: Maybe<Periode | DatePeriod>): PeriodState => {
    if (isGhostPeriode(period)) return getGhostPeriodState(period);
    if (isInfotrygdPeriod(period)) return getInfotrygdPeriodState(period);
    if (isUberegnetPeriode(period)) return getUberegnetPeriodState(period);
    if (!isBeregnetPeriode(period)) return 'ukjent';

    switch (period.tilstand) {
        case Periodetilstand.Venter:
            return 'venter';
        case Periodetilstand.RevurderingFeilet:
            return 'revurderingFeilet';
    }

    switch (period.utbetaling.type) {
        case Utbetalingtype.Utbetaling: {
            switch (period.utbetaling.status) {
                case Utbetalingstatus.Ubetalt:
                    return hasOppgave(period) ? 'oppgaver' : 'venter';
                case Utbetalingstatus.Ikkegodkjent:
                    return 'avslag';
                case Utbetalingstatus.Godkjent:
                case Utbetalingstatus.Sendt:
                case Utbetalingstatus.Overfort:
                    return hasBeenAssessedAutomatically(period) ? 'tilUtbetalingAutomatisk' : 'tilUtbetaling';
                case Utbetalingstatus.Utbetalt:
                    return hasBeenAssessedAutomatically(period) ? 'utbetaltAutomatisk' : 'utbetalt';
                default:
                    return getDefaultPeriodState(period);
            }
        }
        case Utbetalingtype.Revurdering: {
            switch (period.utbetaling.status) {
                case Utbetalingstatus.Ubetalt:
                    return 'revurderes';
                case Utbetalingstatus.Ikkegodkjent:
                    return 'avslag';
                case Utbetalingstatus.Godkjent:
                case Utbetalingstatus.Sendt:
                case Utbetalingstatus.Overfort:
                case Utbetalingstatus.Utbetalt:
                case Utbetalingstatus.Godkjentutenutbetaling:
                    return hasAtLeastOne(period, Utbetalingsdagtype.Navdag) ? 'revurdert' : 'revurdertIngenUtbetaling';
                case Utbetalingstatus.Utbetalingfeilet:
                    return 'revurderingFeilet';
                default:
                    return getDefaultPeriodState(period);
            }
        }
        case Utbetalingtype.Annullering: {
            switch (period.utbetaling.status) {
                case Utbetalingstatus.Godkjent:
                case Utbetalingstatus.Sendt:
                case Utbetalingstatus.Overfort:
                    return 'tilAnnullering';
                case Utbetalingstatus.Annullert:
                    return 'annullert';
                case Utbetalingstatus.Utbetalingfeilet:
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
        case 'revurderingFeilet':
            return 'attention';
        case 'feilet':
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
