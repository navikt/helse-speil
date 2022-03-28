import React from 'react';
import styled from '@emotion/styled';
import { BodyShort } from '@navikt/ds-react';

import { Varsel } from '@components/Varsel';
import { GhostPeriode, Periode } from '@io/graphql';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode } from '@utils/typeguards';

import { Aktivitetsloggvarsler } from './Aktivetsloggvarsler';

type VarselObject = {
    grad: 'info' | 'suksess' | 'advarsel' | 'feil';
    melding: string;
};

const tilstandInfoVarsel = (state: PeriodState): VarselObject | null => {
    switch (state) {
        case 'kunFerie':
        case 'kunPermisjon':
        case 'revurdertIngenUtbetaling':
        case 'ingenUtbetaling':
            return { grad: 'info', melding: 'Perioden er godkjent, ingen utbetaling.' };
        case 'revurderes':
            return { grad: 'info', melding: 'Revurdering er igangsatt og må fullføres.' };
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
            return { grad: 'feil', melding: 'Annulleringen feilet. Kontakt utviklerteamet.' };
        case 'feilet':
            return { grad: 'feil', melding: 'Utbetalingen feilet.' };
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
    state === 'oppgaver' && (!oppgavereferanse || oppgavereferanse.length === 0)
        ? {
              grad: 'feil',
              melding: `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er 
              forsøkt utbetalt, men at det er forsinkelser i systemet.`,
          }
        : null;

const ukjentTilstandsvarsel = (state: PeriodState): VarselObject | null =>
    state === 'ukjent' ? { grad: 'feil', melding: 'Kunne ikke lese informasjon om sakens tilstand.' } : null;

const Saksbildevarsel = styled(Varsel)`
    border-top-style: none;
    border-left-style: none;
    border-right-style: none;
`;

interface SaksbildevarslerProps {
    activePeriod: Periode | GhostPeriode;
}

export const Saksbildevarsler = ({ activePeriod }: SaksbildevarslerProps) => {
    const periodState = getPeriodState(activePeriod);
    const oppgavereferanse = isBeregnetPeriode(activePeriod) ? activePeriod.oppgavereferanse : null;

    const infoVarsler: VarselObject[] = [
        tilstandInfoVarsel(periodState),
        utbetalingsvarsel(periodState),
        vedtaksperiodeVenterVarsel(periodState),
    ].filter((it) => it) as VarselObject[];

    const feilVarsler: VarselObject[] = [
        tilstandFeilVarsel(periodState),
        ukjentTilstandsvarsel(periodState),
        manglendeOppgavereferansevarsel(periodState, oppgavereferanse),
    ].filter((it) => it) as VarselObject[];

    const skalViseAktivtetsloggvarsler = isBeregnetPeriode(activePeriod);

    return (
        <div className="Saksbildevarsler">
            {infoVarsler.map(({ grad, melding }, index) => (
                <Saksbildevarsel variant={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Saksbildevarsel>
            ))}
            {skalViseAktivtetsloggvarsler && <Aktivitetsloggvarsler varsler={activePeriod.varsler} />}
            {feilVarsler.map(({ grad, melding }, index) => (
                <Saksbildevarsel variant={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Saksbildevarsel>
            ))}
        </div>
    );
};
