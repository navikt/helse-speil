import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { Accordion, Alert, BodyShort } from '@navikt/ds-react';

import { Maybe, Overstyring, VarselDto, Varselstatus } from '@io/graphql';
import { useInntektOgRefusjon } from '@state/overstyring';
import { DateString, PeriodState } from '@typer/shared';
import {
    isArbeidsforholdoverstyring,
    isDagoverstyring,
    isInntektoverstyring,
    isMinimumSykdomsgradsoverstyring,
    isSykepengegrunnlagskjønnsfastsetting,
} from '@utils/typeguards';

import { KalkulerEndringerVarsel } from './KalkulerEndringerVarsel';
import { Varsler } from './Varsler';

import styles from './Saksbildevarsler.module.css';

export type VarselObject = {
    grad: 'info' | 'success' | 'warning' | 'error';
    melding: string;
};

const sendtTilBeslutter = (erBeslutteroppgaveOgErTidligereSaksbehandler: boolean): Maybe<VarselObject> => {
    if (erBeslutteroppgaveOgErTidligereSaksbehandler) {
        return { grad: 'info', melding: 'Saken er sendt til beslutter' };
    }
    return null;
};
const tilstandfeil = (state: PeriodState): Maybe<VarselObject> => {
    switch (state) {
        case 'annulleringFeilet':
            return { grad: 'error', melding: 'Annulleringen feilet. Kontakt utviklerteamet.' };
        case 'utbetalingFeilet':
            return { grad: 'error', melding: 'Utbetalingen feilet.' };
        default:
            return null;
    }
};

const vedtaksperiodeVenter = (state: PeriodState): Maybe<VarselObject> =>
    state === 'venter'
        ? { grad: 'info', melding: 'Ikke klar til behandling - avventer system' }
        : state === 'venterPåInntektsopplysninger'
          ? { grad: 'info', melding: 'Ikke klar til behandling - venter på inntektsmelding' }
          : state === 'venterPåKiling'
            ? {
                  grad: 'info',
                  melding:
                      'Avventer behandling av en annen periode. Dette kan skyldes at søknad eller inntektsmelding for denne eller en annen arbeidsgiver mangler.',
              }
            : null;

const manglendeOppgavereferanse = (state: PeriodState, oppgavereferanse?: Maybe<string>): Maybe<VarselObject> =>
    state === 'tilGodkjenning' && (typeof oppgavereferanse !== 'string' || oppgavereferanse.length === 0)
        ? {
              grad: 'error',
              melding: `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er 
              forsøkt utbetalt, men at det er forsinkelser i systemet.`,
          }
        : null;

const manglendeAvviksvurdering = (manglerAvviksvurdering: boolean): Maybe<VarselObject> =>
    manglerAvviksvurdering
        ? {
              grad: 'error',
              melding: `Systemet er ikke ferdig med avviksvurdering. Perioden kan ikke behandles enda.`,
          }
        : null;

const ukjentTilstand = (state: PeriodState): Maybe<VarselObject> =>
    state === 'ukjent' ? { grad: 'error', melding: 'Kunne ikke lese informasjon om sakens tilstand.' } : null;

const beslutteroppgave = (
    harTotrinnsvurdering: boolean,
    varsler: Array<VarselDto>,
    harDagOverstyringer = false,
    harTilkommenInntektEndring: boolean,
    åpneEndringerPåPerson?: Maybe<Array<Overstyring>>,
    activePeriodTom?: string,
    navnPåDeaktiverteGhostArbeidsgivere?: string,
): string[] | null => {
    if (!harTotrinnsvurdering || (åpneEndringerPåPerson == null && !harTilkommenInntektEndring)) return null;
    const aktuelleOverstyringer = åpneEndringerPåPerson?.filter((overstyring) => !overstyring.ferdigstilt) ?? [];

    const årsaker: string[] = [];

    if (harDagOverstyringer || harRelevanteDagoverstyringer(aktuelleOverstyringer ?? [], activePeriodTom)) {
        årsaker.push('Overstyring av dager');
    }

    if (
        aktuelleOverstyringer.some(
            (it) =>
                isInntektoverstyring(it) &&
                it.inntekt.fraManedligInntekt !== it.inntekt.manedligInntekt &&
                it.inntekt.begrunnelse !== 'tilkommen',
        ) ??
        false
    ) {
        årsaker.push('Overstyring av månedsinntekt');
    }

    if (
        aktuelleOverstyringer.some(
            (it) =>
                isInntektoverstyring(it) &&
                it.inntekt.fraManedligInntekt !== it.inntekt.manedligInntekt &&
                it.inntekt.begrunnelse === 'tilkommen',
        )
    ) {
        årsaker.push('Overstyring av månedsinntekt på tilkommen inntekt');
    }

    if (
        aktuelleOverstyringer.some(
            (it) =>
                isInntektoverstyring(it) &&
                JSON.stringify(it.inntekt.fraRefusjonsopplysninger) !==
                    JSON.stringify(it.inntekt.refusjonsopplysninger),
        )
    ) {
        årsaker.push('Overstyring av Refusjon');
    }

    if (aktuelleOverstyringer.some(isArbeidsforholdoverstyring)) {
        årsaker.push(`Overstyring av annet arbeidsforhold (${navnPåDeaktiverteGhostArbeidsgivere})`);
    }

    if (aktuelleOverstyringer.some(isSykepengegrunnlagskjønnsfastsetting)) {
        årsaker.push('Skjønnsfastsettelse');
    }

    if (aktuelleOverstyringer.some(isMinimumSykdomsgradsoverstyring)) {
        årsaker.push('Vurdering av minimum sykdomsgrad');
    }

    if (varsler.some((varsel) => varsel.kode === 'RV_IV_10')) {
        årsaker.push('Brukerutbetaling og refusjon på grunn av manglende inntektsmelding');
    }

    if (varsler.some((varsel) => varsel.kode === 'RV_MV_1')) {
        årsaker.push('Lovvalg og medlemskapsvurdering');
    }

    if (harTilkommenInntektEndring) {
        årsaker.push('Tilkommen inntekt');
    }

    return årsaker;
};

const harRelevanteDagoverstyringer = (overstyringer: Array<Overstyring>, tom?: DateString): boolean => {
    return (
        typeof tom === 'string' &&
        overstyringer.some((it) => isDagoverstyring(it) && dayjs(it.dager[0]?.dato).isSameOrBefore(tom))
    );
};

interface SaksbildevarslerProps {
    periodState: PeriodState;
    oppgavereferanse?: Maybe<string>;
    varsler?: Maybe<Array<VarselDto>>;
    erTidligereSaksbehandler?: boolean;
    erBeslutteroppgave?: boolean;
    åpneEndringerPåPerson?: Maybe<Array<Overstyring>>;
    harDagOverstyringer?: boolean;
    activePeriodTom?: string;
    skjæringstidspunkt?: string;
    navnPåDeaktiverteGhostArbeidsgivere?: string;
    harTotrinnsvurdering: boolean;
    harTilkommenInntektEndring: boolean;
    manglerAvviksvurdering: boolean;
}

export const Saksbildevarsler = ({
    periodState,
    oppgavereferanse,
    varsler,
    erTidligereSaksbehandler = false,
    erBeslutteroppgave = false,
    åpneEndringerPåPerson,
    harDagOverstyringer,
    activePeriodTom,
    skjæringstidspunkt,
    navnPåDeaktiverteGhostArbeidsgivere,
    harTotrinnsvurdering,
    harTilkommenInntektEndring,
    manglerAvviksvurdering,
}: SaksbildevarslerProps) => {
    const [open, setOpen] = useState(true);
    const lokaleInntektoverstyringer = useInntektOgRefusjon();

    const beslutteroppgaveKontrollelementer: string[] =
        beslutteroppgave(
            harTotrinnsvurdering,
            varsler ?? [],
            harDagOverstyringer,
            harTilkommenInntektEndring,
            åpneEndringerPåPerson,
            activePeriodTom,
            navnPåDeaktiverteGhostArbeidsgivere,
        ) ?? [];

    const infoVarsler: VarselObject[] = [
        sendtTilBeslutter(erTidligereSaksbehandler && erBeslutteroppgave),
        vedtaksperiodeVenter(periodState),
    ].filter((it) => it) as VarselObject[];

    const feilVarsler: VarselObject[] = [
        tilstandfeil(periodState),
        ukjentTilstand(periodState),
        manglendeOppgavereferanse(periodState, oppgavereferanse),
        manglendeAvviksvurdering(manglerAvviksvurdering),
    ].filter((it) => it) as VarselObject[];

    const skalViseVarsler =
        (varsler?.length ?? 0) > 0 ||
        beslutteroppgaveKontrollelementer.length > 0 ||
        infoVarsler.length > 0 ||
        feilVarsler.length > 0;
    const skalViseKalkulerEndringerVarsel =
        lokaleInntektoverstyringer &&
        lokaleInntektoverstyringer?.skjæringstidspunkt === skjæringstidspunkt &&
        lokaleInntektoverstyringer.arbeidsgivere.length > 0;

    if (!skalViseVarsler && !skalViseKalkulerEndringerVarsel) return null;

    const varselheadertekst =
        varsler && varsler.length > 0
            ? `Vis varsler (${
                  varsler.filter(
                      (it) =>
                          it.vurdering?.status === Varselstatus.Vurdert ||
                          it.vurdering?.status === Varselstatus.Godkjent,
                  ).length
              } av ${varsler.length} varsler er sjekket)`
            : 'Vis varsler';

    return (
        <div className="Saksbildevarsler">
            {skalViseVarsler && (
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
                            {beslutteroppgaveKontrollelementer.length > 0 && (
                                <Alert className={styles.Varsel} variant="info" key="beslutteroppgave">
                                    <BodyShort weight="semibold">Kontroller:</BodyShort>
                                    <ul style={{ marginBlock: 0, paddingInline: 0, listStylePosition: 'inside' }}>
                                        {beslutteroppgaveKontrollelementer.map((kontrollelementer, index) => (
                                            <li key={index}>{kontrollelementer}</li>
                                        ))}
                                    </ul>
                                </Alert>
                            )}
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
            )}
            {skalViseKalkulerEndringerVarsel && (
                <KalkulerEndringerVarsel lokaleInntektoverstyringer={lokaleInntektoverstyringer} />
            )}
        </div>
    );
};
