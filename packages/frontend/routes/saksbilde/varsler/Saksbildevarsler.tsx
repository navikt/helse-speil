import dayjs from 'dayjs';
import React from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import { Maybe, Overstyring, VarselDto } from '@io/graphql';
import {
    isArbeidsforholdoverstyring,
    isDagoverstyring,
    isInntektoverstyring,
    isSykepengegrunnlagskjønnsfastsetting,
} from '@utils/typeguards';

import { KalkulerEndringerVarsel } from './KalkulerEndringerVarsel';
import { Varsler } from './Varsler';

import styles from './Saksbildevarsler.module.css';

type VarselObject = {
    grad: 'info' | 'success' | 'warning' | 'error';
    melding: string;
};

const sendtTilBeslutter = (erBeslutteroppgaveOgErTidligereSaksbehandler: boolean): VarselObject | null => {
    if (erBeslutteroppgaveOgErTidligereSaksbehandler) {
        return { grad: 'info', melding: 'Saken er sendt til beslutter' };
    }
    return null;
};

const tilstandinfo = (state: PeriodState): VarselObject | null => {
    switch (state) {
        case 'kunFerie':
        case 'kunPermisjon':
        case 'revurdertIngenUtbetaling':
        case 'ingenUtbetaling':
            return { grad: 'info', melding: 'Perioden er godkjent, ingen utbetaling.' };
        case 'annullert':
            return { grad: 'info', melding: 'Utbetalingen er annullert.' };
        case 'tilAnnullering':
            return { grad: 'info', melding: 'Annullering venter.' };
        default:
            return null;
    }
};

const tilstandfeil = (state: PeriodState): VarselObject | null => {
    switch (state) {
        case 'annulleringFeilet':
            return { grad: 'error', melding: 'Annulleringen feilet. Kontakt utviklerteamet.' };
        case 'utbetalingFeilet':
            return { grad: 'error', melding: 'Utbetalingen feilet.' };
        default:
            return null;
    }
};

const utbetaling = (state: PeriodState): VarselObject | null =>
    ['tilUtbetaling', 'utbetalt', 'revurdert'].includes(state)
        ? { grad: 'info', melding: 'Utbetalingen er sendt til oppdragsystemet.' }
        : ['tilUtbetalingAutomatisk', 'utbetaltAutomatisk'].includes(state)
        ? { grad: 'info', melding: 'Perioden er automatisk godkjent' }
        : null;

const vedtaksperiodeVenter = (state: PeriodState): VarselObject | null =>
    state === 'venter'
        ? { grad: 'info', melding: 'Ikke klar til behandling - avventer system' }
        : state === 'venterPåKiling'
        ? {
              grad: 'info',
              melding:
                  'Avventer behandling av en annen periode. Dette kan skyldes at søknad eller inntektsmelding for denne eller en annen arbeidsgiver mangler.',
          }
        : null;

const manglendeOppgavereferanse = (state: PeriodState, oppgavereferanse?: string | null): VarselObject | null =>
    state === 'tilGodkjenning' && (typeof oppgavereferanse !== 'string' || oppgavereferanse.length === 0)
        ? {
              grad: 'error',
              melding: `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er 
              forsøkt utbetalt, men at det er forsinkelser i systemet.`,
          }
        : null;

const ukjentTilstand = (state: PeriodState): VarselObject | null =>
    state === 'ukjent' ? { grad: 'error', melding: 'Kunne ikke lese informasjon om sakens tilstand.' } : null;

const harRelevanteDagoverstyringer = (overstyringer: Array<Overstyring>, tom?: DateString): boolean => {
    return (
        typeof tom === 'string' &&
        overstyringer.some((it) => isDagoverstyring(it) && dayjs(it.dager[0].dato).isSameOrBefore(tom))
    );
};

const beslutteroppgave = (
    periodState: PeriodState,
    erBeslutteroppgave = false,
    endringerEtterNyesteUtbetalingPåPerson?: Maybe<Array<Overstyring>>,
    harDagOverstyringer = false,
    activePeriodTom?: string,
    navnPåDeaktiverteGhostArbeidsgivere?: string,
) => {
    if (erBeslutteroppgave && ['tilGodkjenning', 'revurderes'].includes(periodState)) {
        const årsaker = [];

        if (
            harDagOverstyringer ||
            harRelevanteDagoverstyringer(endringerEtterNyesteUtbetalingPåPerson ?? [], activePeriodTom)
        ) {
            årsaker.push('Overstyring av dager');
        }

        if (
            endringerEtterNyesteUtbetalingPåPerson?.some(
                (it) => isInntektoverstyring(it) && it.inntekt.fraManedligInntekt !== it.inntekt.manedligInntekt,
            ) ??
            false
        ) {
            årsaker.push('Overstyring av månedsinntekt');
        }

        if (
            endringerEtterNyesteUtbetalingPåPerson?.some(
                (it) =>
                    isInntektoverstyring(it) &&
                    JSON.stringify(it.inntekt.fraRefusjonsopplysninger) !==
                        JSON.stringify(it.inntekt.refusjonsopplysninger),
            ) ??
            false
        ) {
            årsaker.push('Overstyring av Refusjon');
        }

        if (endringerEtterNyesteUtbetalingPåPerson?.some(isArbeidsforholdoverstyring) ?? false) {
            årsaker.push(`Overstyring av annet arbeidsforhold (${navnPåDeaktiverteGhostArbeidsgivere})`);
        }

        if (endringerEtterNyesteUtbetalingPåPerson?.some(isSykepengegrunnlagskjønnsfastsetting) ?? false) {
            årsaker.push('Skjønnsfastsettelse');
        }

        if (årsaker.length > 0) {
            const overstyringÅrsaker = årsaker.join(', ').replace(/,(?=[^,]*$)/, ' og');
            return { grad: 'info', melding: `Beslutteroppgave: ${overstyringÅrsaker}` };
        }
    }
    return null;
};

interface SaksbildevarslerProps {
    periodState: PeriodState;
    oppgavereferanse?: Maybe<string>;
    varsler?: Maybe<Array<VarselDto>>;
    erTidligereSaksbehandler?: boolean;
    erBeslutteroppgave?: boolean;
    endringerEtterNyesteUtbetalingPåPerson?: Maybe<Array<Overstyring>>;
    harDagOverstyringer?: boolean;
    activePeriodTom?: string;
    skjæringstidspunkt?: string;
    navnPåDeaktiverteGhostArbeidsgivere?: string;
    harBlittSkjønnsmessigFastsatt?: boolean;
    avviksprosent?: Maybe<number>;
}

export const Saksbildevarsler = ({
    periodState,
    oppgavereferanse,
    varsler,
    erTidligereSaksbehandler = false,
    erBeslutteroppgave = false,
    endringerEtterNyesteUtbetalingPåPerson,
    harDagOverstyringer,
    activePeriodTom,
    skjæringstidspunkt,
    navnPåDeaktiverteGhostArbeidsgivere,
    harBlittSkjønnsmessigFastsatt = false,
    avviksprosent,
}: SaksbildevarslerProps) => {
    const infoVarsler: VarselObject[] = [
        sendtTilBeslutter(erTidligereSaksbehandler && erBeslutteroppgave),
        tilstandinfo(periodState),
        utbetaling(periodState),
        vedtaksperiodeVenter(periodState),
        beslutteroppgave(
            periodState,
            erBeslutteroppgave,
            endringerEtterNyesteUtbetalingPåPerson,
            harDagOverstyringer,
            activePeriodTom,
            navnPåDeaktiverteGhostArbeidsgivere,
        ),
    ].filter((it) => it) as VarselObject[];

    const feilVarsler: VarselObject[] = [
        tilstandfeil(periodState),
        ukjentTilstand(periodState),
        manglendeOppgavereferanse(periodState, oppgavereferanse),
    ].filter((it) => it) as VarselObject[];

    return (
        <div className="Saksbildevarsler">
            {infoVarsler.map(({ grad, melding }, index) => (
                <Alert className={styles.Varsel} variant={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Alert>
            ))}
            {varsler && (
                <Varsler
                    varsler={varsler}
                    harBlittSkjønnsmessigFastsatt={harBlittSkjønnsmessigFastsatt}
                    tilSkjønnsfastsettelse={periodState === 'tilSkjønnsfastsettelse'}
                    avviksprosent={avviksprosent ?? 0}
                />
            )}
            {feilVarsler.map(({ grad, melding }, index) => (
                <Alert className={styles.Varsel} variant={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Alert>
            ))}
            <KalkulerEndringerVarsel skjæringstidspunkt={skjæringstidspunkt} />
        </div>
    );
};
