import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { Accordion, Alert, BodyShort } from '@navikt/ds-react';

import { DateString, PeriodState } from '@/types/shared';
import { Maybe, Overstyring, VarselDto, Varselstatus } from '@io/graphql';
import {
    isArbeidsforholdoverstyring,
    isDagoverstyring,
    isInntektoverstyring,
    isSykepengegrunnlagskjønnsfastsetting,
} from '@utils/typeguards';

import { KalkulerEndringerVarsel } from './KalkulerEndringerVarsel';
import { Varsler } from './Varsler';

import styles from './Saksbildevarsler.module.css';

export type VarselObject = {
    grad: 'info' | 'success' | 'warning' | 'error';
    melding: string;
};

const sendtTilBeslutter = (erBeslutteroppgaveOgErTidligereSaksbehandler: boolean): VarselObject | null => {
    if (erBeslutteroppgaveOgErTidligereSaksbehandler) {
        return { grad: 'info', melding: 'Saken er sendt til beslutter' };
    }
    return null;
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
}: SaksbildevarslerProps) => {
    const [open, setOpen] = useState(true);
    const infoVarsler: VarselObject[] = [
        sendtTilBeslutter(erTidligereSaksbehandler && erBeslutteroppgave),
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

    const varselheadertekst = varsler
        ? `Vis varsler (${
              varsler.filter(
                  (it) =>
                      it.vurdering?.status === Varselstatus.Vurdert || it.vurdering?.status === Varselstatus.Godkjent,
              ).length
          } av ${varsler.length} varsler er sjekket)`
        : 'Vis varsler';

    return (
        <div className="Saksbildevarsler">
            <Accordion>
                <Accordion.Item open={open}>
                    <Accordion.Header
                        className={classNames(
                            styles.varslerheader,
                            infoVarsler.length === 0 &&
                                varsler?.length === 0 &&
                                feilVarsler.length === 0 &&
                                styles.skjult,
                        )}
                        onClick={() => {
                            setOpen((prevState) => !prevState);
                        }}
                    >
                        {!open ? varselheadertekst : 'Skjul varsler'}
                    </Accordion.Header>
                    <Accordion.Content className={styles.varsler}>
                        {infoVarsler.map(({ grad, melding }, index) => (
                            <Alert className={styles.Varsel} variant={grad} key={index}>
                                <BodyShort>{melding}</BodyShort>
                            </Alert>
                        ))}
                        {varsler && <Varsler varsler={varsler} />}
                        {feilVarsler.map(({ grad, melding }, index) => (
                            <Alert className={styles.Varsel} variant={grad} key={index}>
                                <BodyShort>{melding}</BodyShort>
                            </Alert>
                        ))}
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
            <KalkulerEndringerVarsel skjæringstidspunkt={skjæringstidspunkt} />
        </div>
    );
};
