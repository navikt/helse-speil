import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Aktivitetsloggvarsler } from './Aktivetsloggvarsler';
import { Varsel } from '../../../components/Varsel';
import styled from '@emotion/styled';

type VarselObject = {
    grad: 'info' | 'suksess' | 'advarsel' | 'feil';
    melding: string;
};

const tilstandInfoVarsel = (tilstand: Tidslinjetilstand): VarselObject | null => {
    switch (tilstand) {
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

const tilstandFeilVarsel = (tilstand: Tidslinjetilstand): VarselObject | null => {
    switch (tilstand) {
        case 'annulleringFeilet':
            return { grad: 'feil', melding: 'Annulleringen feilet. Kontakt utviklerteamet.' };
        case 'feilet':
            return { grad: 'feil', melding: 'Utbetalingen feilet.' };
        default:
            return null;
    }
};

const utbetalingsvarsel = (tilstand: Tidslinjetilstand): VarselObject | null =>
    ['tilUtbetaling', 'utbetalt', 'revurdert'].includes(tilstand)
        ? { grad: 'info', melding: 'Utbetalingen er sendt til oppdragsystemet.' }
        : ['tilUtbetalingAutomatisk', 'utbetaltAutomatisk'].includes(tilstand)
        ? { grad: 'info', melding: 'Perioden er automatisk godkjent' }
        : null;

const vedtaksperiodeVenterVarsel = (tilstand: Tidslinjetilstand): VarselObject | null =>
    tilstand === 'venter'
        ? { grad: 'info', melding: 'Ikke klar til behandling - avventer system' }
        : tilstand === 'venterPåKiling'
        ? { grad: 'info', melding: 'Ikke klar for utbetaling. Avventer behandling av tidligere periode.' }
        : null;

const manglendeOppgavereferansevarsel = (tilstand: Tidslinjetilstand, oppgavereferanse?: string): VarselObject | null =>
    tilstand === 'oppgaver' && (!oppgavereferanse || oppgavereferanse.length === 0)
        ? {
              grad: 'feil',
              melding: `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er 
              forsøkt utbetalt, men at det er forsinkelser i systemet.`,
          }
        : null;

const ukjentTilstandsvarsel = (tilstand: Tidslinjetilstand): VarselObject | null =>
    tilstand === 'ukjent' ? { grad: 'feil', melding: 'Kunne ikke lese informasjon om sakens tilstand.' } : null;

const Saksbildevarsel = styled(Varsel)`
    border-top-style: none;
    border-left-style: none;
    border-right-style: none;
`;

interface SaksbildevarslerProps {
    aktivPeriode: TidslinjeperiodeMedSykefravær;
    vedtaksperiode: Vedtaksperiode;
    oppgavereferanse?: string;
}

export const Saksbildevarsler = ({ aktivPeriode, vedtaksperiode, oppgavereferanse }: SaksbildevarslerProps) => {
    const infoVarsler: VarselObject[] = [
        tilstandInfoVarsel(aktivPeriode.tilstand),
        utbetalingsvarsel(aktivPeriode.tilstand),
        vedtaksperiodeVenterVarsel(aktivPeriode.tilstand),
    ].filter((it) => it) as VarselObject[];

    const feilVarsler: VarselObject[] = [
        tilstandFeilVarsel(aktivPeriode.tilstand),
        ukjentTilstandsvarsel(aktivPeriode.tilstand),
        manglendeOppgavereferansevarsel(aktivPeriode.tilstand, oppgavereferanse),
    ].filter((it) => it) as VarselObject[];

    return (
        <div className="Saksbildevarsler">
            {infoVarsler.map(({ grad, melding }, index) => (
                <Saksbildevarsel variant={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Saksbildevarsel>
            ))}
            <Aktivitetsloggvarsler varsler={vedtaksperiode.aktivitetslog} />
            {feilVarsler.map(({ grad, melding }, index) => (
                <Saksbildevarsel variant={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Saksbildevarsel>
            ))}
        </div>
    );
};
