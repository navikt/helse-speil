import React from 'react';
import dayjs from 'dayjs';

import { Alert, BodyShort } from '@navikt/ds-react';
import { Maybe, Overstyring } from '@io/graphql';
import { isArbeidsforholdoverstyring, isDagoverstyring, isInntektoverstyring } from '@utils/typeguards';

import { Aktivitetsloggvarsler } from './Aktivetsloggvarsler';

import styles from './Saksbildevarsler.module.css';

type VarselObject = {
    grad: 'info' | 'success' | 'warning' | 'error';
    melding: string;
};

const tilgangInfoVarsel = (erBeslutteroppgaveOgErTidligereSaksbehandler?: boolean): VarselObject | null => {
    if (erBeslutteroppgaveOgErTidligereSaksbehandler) {
        return { grad: 'info', melding: 'Saken er sendt til beslutter' };
    }
    return null;
};

const tilstandInfoVarsel = (state: PeriodState): VarselObject | null => {
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

const tilstandFeilVarsel = (state: PeriodState): VarselObject | null => {
    switch (state) {
        case 'annulleringFeilet':
            return { grad: 'error', melding: 'Annulleringen feilet. Kontakt utviklerteamet.' };
        case 'utbetalingFeilet':
            return { grad: 'error', melding: 'Utbetalingen feilet.' };
        default:
            return null;
    }
};

const utbetalingsvarsel = (state: PeriodState): VarselObject | null =>
    ['tilUtbetaling', 'utbetalt', 'revurdert'].includes(state)
        ? { grad: 'info', melding: 'Utbetalingen er sendt til oppdragsystemet.' }
        : ['tilUtbetalingAutomatisk', 'utbetaltAutomatisk'].includes(state)
        ? { grad: 'info', melding: 'Perioden er automatisk godkjent' }
        : null;

const vedtaksperiodeVenterVarsel = (state: PeriodState): VarselObject | null =>
    state === 'venter'
        ? { grad: 'info', melding: 'Ikke klar til behandling - avventer system' }
        : state === 'venterPåKiling'
        ? { grad: 'info', melding: 'Ikke klar for utbetaling. Avventer behandling av tidligere periode.' }
        : null;

const manglendeOppgavereferansevarsel = (state: PeriodState, oppgavereferanse?: string | null): VarselObject | null =>
    state === 'tilGodkjenning' && (!oppgavereferanse || oppgavereferanse.length === 0)
        ? {
              grad: 'error',
              melding: `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er 
              forsøkt utbetalt, men at det er forsinkelser i systemet.`,
          }
        : null;

const ukjentTilstandsvarsel = (state: PeriodState): VarselObject | null =>
    state === 'ukjent' ? { grad: 'error', melding: 'Kunne ikke lese informasjon om sakens tilstand.' } : null;

const beslutteroppgaveVarsel = (
    periodState: PeriodState,
    varsler?: Maybe<Array<string>>,
    erBeslutteroppgave?: boolean,
    harVurderLovvalgOgMedlemskapVarsel?: boolean,
    endringerEtterNyesteUtbetalingPåPerson?: Maybe<Array<Overstyring>>,
    harDagOverstyringer?: boolean,
    activePeriodTom?: string,
) => {
    if (erBeslutteroppgave && ['tilGodkjenning', 'revurderes'].includes(periodState)) {
        const overstyringÅrsak = [];
        (endringerEtterNyesteUtbetalingPåPerson?.some(
            (it) => isDagoverstyring(it) && dayjs(it.dager[0].dato).isSameOrBefore(activePeriodTom),
        ) ||
            harDagOverstyringer) &&
            overstyringÅrsak.push('Overstyring av utbetalingsdager');
        endringerEtterNyesteUtbetalingPåPerson?.some((it) => isInntektoverstyring(it)) &&
            overstyringÅrsak.push('Overstyring av inntekt');
        endringerEtterNyesteUtbetalingPåPerson?.some((it) => isArbeidsforholdoverstyring(it)) &&
            overstyringÅrsak.push('Overstyring av annet arbeidsforhold');
        harVurderLovvalgOgMedlemskapVarsel && overstyringÅrsak.push('Lovvalg og medlemskap');

        if (overstyringÅrsak.length > 0) {
            const overstyringÅrsaker = overstyringÅrsak.join(', ').replace(/,(?=[^,]*$)/, ' og');
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
    erTidligereSaksbehandler?: boolean;
    erBeslutteroppgave?: boolean;
    harVurderLovvalgOgMedlemskapVarsel?: boolean;
    endringerEtterNyesteUtbetalingPåPerson?: Maybe<Array<Overstyring>>;
    harDagOverstyringer?: boolean;
    activePeriodTom?: string;
}

export const Saksbildevarsler = ({
    periodState,
    oppgavereferanse,
    varsler,
    erTidligereSaksbehandler,
    erBeslutteroppgave,
    harVurderLovvalgOgMedlemskapVarsel,
    endringerEtterNyesteUtbetalingPåPerson,
    harDagOverstyringer,
    activePeriodTom,
}: SaksbildevarslerProps) => {
    const infoVarsler: VarselObject[] = [
        tilgangInfoVarsel(erTidligereSaksbehandler && erBeslutteroppgave),
        tilstandInfoVarsel(periodState),
        utbetalingsvarsel(periodState),
        vedtaksperiodeVenterVarsel(periodState),
        beslutteroppgaveVarsel(
            periodState,
            varsler,
            erBeslutteroppgave,
            harVurderLovvalgOgMedlemskapVarsel,
            endringerEtterNyesteUtbetalingPåPerson,
            harDagOverstyringer,
            activePeriodTom,
        ),
    ].filter((it) => it) as VarselObject[];

    const feilVarsler: VarselObject[] = [
        tilstandFeilVarsel(periodState),
        ukjentTilstandsvarsel(periodState),
        manglendeOppgavereferansevarsel(periodState, oppgavereferanse),
    ].filter((it) => it) as VarselObject[];

    return (
        <div className="Saksbildevarsler">
            {infoVarsler.map(({ grad, melding }, index) => (
                <Alert className={styles.Varsel} variant={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Alert>
            ))}
            {varsler && <Aktivitetsloggvarsler varsler={filtrerVarsler(varsler)} />}
            {feilVarsler.map(({ grad, melding }, index) => (
                <Alert className={styles.Varsel} variant={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Alert>
            ))}
        </div>
    );
};
