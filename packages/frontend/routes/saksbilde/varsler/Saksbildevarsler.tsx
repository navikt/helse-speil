import dayjs from 'dayjs';
import React from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import { Maybe, Overstyring, VarselDto } from '@io/graphql';
import { skalViseAvhukbareVarsler, utbetalingTilSykmeldt } from '@utils/featureToggles';
import { isArbeidsforholdoverstyring, isDagoverstyring, isInntektoverstyring } from '@utils/typeguards';

import { Aktivitetsloggvarsler } from './Aktivetsloggvarsler';
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

const ikkeTilgangUTS = (ikkeTilgangUTS: boolean): VarselObject | null => {
    if (ikkeTilgangUTS) {
        return { grad: 'info', melding: 'Du har ikke tilgang til å behandle perioder med utbetaling til sykmeldt' };
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
        ? { grad: 'info', melding: 'Ikke klar for utbetaling. Avventer behandling av tidligere periode.' }
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
    varsler?: Maybe<Array<string>>,
    erBeslutteroppgave: boolean = false,
    harVurderLovvalgOgMedlemskapVarsel: boolean = false,
    endringerEtterNyesteUtbetalingPåPerson?: Maybe<Array<Overstyring>>,
    harDagOverstyringer: boolean = false,
    activePeriodTom?: string
) => {
    if (erBeslutteroppgave && ['tilGodkjenning', 'revurderes'].includes(periodState)) {
        const årsaker = [];

        if (
            harDagOverstyringer ||
            harRelevanteDagoverstyringer(endringerEtterNyesteUtbetalingPåPerson ?? [], activePeriodTom)
        ) {
            årsaker.push('Overstyring av utbetalingsdager');
        }

        if (endringerEtterNyesteUtbetalingPåPerson?.some(isInntektoverstyring) ?? false) {
            årsaker.push('Overstyring av inntekt');
        }

        if (endringerEtterNyesteUtbetalingPåPerson?.some(isArbeidsforholdoverstyring) ?? false) {
            årsaker.push('Overstyring av annet arbeidsforhold');
        }

        if (harVurderLovvalgOgMedlemskapVarsel) {
            årsaker.push('Lovvalg og medlemskap');
        }

        if (årsaker.length > 0) {
            const overstyringÅrsaker = årsaker.join(', ').replace(/,(?=[^,]*$)/, ' og');
            return { grad: 'info', melding: `Beslutteroppgave: ${overstyringÅrsaker}` };
        }
    }
    return null;
};

const filtrerVarsler = (varsler: Array<string>) => {
    return varsler.filter((varsel) => !varsel.includes('Beslutteroppgave:'));
};

interface SaksbildevarslerProps {
    periodState: PeriodState;
    oppgavereferanse?: Maybe<string>;
    varsler?: Maybe<Array<string>>;
    varslerForGenerasjon?: Maybe<Array<VarselDto>>;
    erTidligereSaksbehandler?: boolean;
    periodeMedBrukerutbetaling?: boolean;
    erBeslutteroppgave?: boolean;
    harVurderLovvalgOgMedlemskapVarsel?: boolean;
    endringerEtterNyesteUtbetalingPåPerson?: Maybe<Array<Overstyring>>;
    harDagOverstyringer?: boolean;
    activePeriodTom?: string;
}

type GrupperteVarsler = {
    beslutteroppgaveVarsler: VarselDto[];
    vanligeVarsler: VarselDto[];
};

function grupperVarsler(varslerForGenerasjon: Maybe<Array<VarselDto>> | undefined) {
    return (varslerForGenerasjon || []).reduce(
        (grupperteVarsler: GrupperteVarsler, varsel) => {
            if (varsel.tittel.includes('Beslutteroppgave:')) {
                grupperteVarsler.beslutteroppgaveVarsler.push(varsel);
            } else {
                grupperteVarsler.vanligeVarsler.push(varsel);
            }
            return grupperteVarsler;
        },
        { beslutteroppgaveVarsler: [], vanligeVarsler: [] }
    );
}

export const Saksbildevarsler = ({
    periodState,
    oppgavereferanse,
    varsler,
    varslerForGenerasjon,
    erTidligereSaksbehandler = false,
    periodeMedBrukerutbetaling = false,
    erBeslutteroppgave = false,
    harVurderLovvalgOgMedlemskapVarsel,
    endringerEtterNyesteUtbetalingPåPerson,
    harDagOverstyringer,
    activePeriodTom,
}: SaksbildevarslerProps) => {
    const { vanligeVarsler }: GrupperteVarsler = grupperVarsler(varslerForGenerasjon);
    const infoVarsler: VarselObject[] = [
        sendtTilBeslutter(erTidligereSaksbehandler && erBeslutteroppgave),
        ikkeTilgangUTS(periodeMedBrukerutbetaling && !utbetalingTilSykmeldt),
        tilstandinfo(periodState),
        utbetaling(periodState),
        vedtaksperiodeVenter(periodState),
        beslutteroppgave(
            periodState,
            varsler,
            erBeslutteroppgave,
            harVurderLovvalgOgMedlemskapVarsel,
            endringerEtterNyesteUtbetalingPåPerson,
            harDagOverstyringer,
            activePeriodTom
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
            {!skalViseAvhukbareVarsler && varsler && <Aktivitetsloggvarsler varsler={filtrerVarsler(varsler)} />}
            {skalViseAvhukbareVarsler && varslerForGenerasjon && <Varsler varsler={vanligeVarsler} />}
            {feilVarsler.map(({ grad, melding }, index) => (
                <Alert className={styles.Varsel} variant={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Alert>
            ))}
        </div>
    );
};
