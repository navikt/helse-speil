import React from 'react';
import { Alert, BodyShort } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';

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
) => {
    if (erBeslutteroppgave && varsler && ['tilGodkjenning', 'revurderes'].includes(periodState)) {
        const beslutteroppgavevarsel = Array.from(varsler)
            .reverse()
            .find((varsel) => varsel.includes('Beslutteroppgave:'));
        if (beslutteroppgavevarsel) {
            return { grad: 'info', melding: beslutteroppgavevarsel };
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
}

export const Saksbildevarsler = ({
    periodState,
    oppgavereferanse,
    varsler,
    erTidligereSaksbehandler,
    erBeslutteroppgave,
}: SaksbildevarslerProps) => {
    const infoVarsler: VarselObject[] = [
        tilgangInfoVarsel(erTidligereSaksbehandler && erBeslutteroppgave),
        tilstandInfoVarsel(periodState),
        utbetalingsvarsel(periodState),
        vedtaksperiodeVenterVarsel(periodState),
        beslutteroppgaveVarsel(periodState, varsler, erBeslutteroppgave),
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
