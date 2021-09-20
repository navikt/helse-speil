import React from 'react';

import { BodyShort } from '@navikt/ds-react';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import '@navikt/helse-frontend-varsel/lib/main.css';

import { capitalizeName } from '../../../utils/locale';

import { Aktivitetsloggvarsler } from './Aktivetsloggvarsler';
import { Saksbildevarsel } from './Saksbildevarsel';

type VarselObject = {
    grad: Varseltype;
    melding: string;
};

const tilstandInfoVarsel = (tilstand: Tidslinjetilstand): VarselObject | null => {
    switch (tilstand) {
        case 'kunFerie':
        case 'kunPermisjon':
        case 'revurdertIngenUtbetaling':
        case 'ingenUtbetaling':
            return { grad: Varseltype.Info, melding: 'Perioden er godkjent, ingen utbetaling.' };
        case 'revurderes':
            return { grad: Varseltype.Info, melding: 'Revurdering er igangsatt og må fullføres.' };
        case 'annullert':
            return { grad: Varseltype.Info, melding: 'Utbetalingen er annullert.' };
        case 'tilAnnullering':
            return { grad: Varseltype.Info, melding: 'Annullering venter.' };
        default:
            return null;
    }
};

const tilstandFeilVarsel = (tilstand: Tidslinjetilstand): VarselObject | null => {
    switch (tilstand) {
        case 'annulleringFeilet':
            return { grad: Varseltype.Feil, melding: 'Annulleringen feilet. Kontakt utviklerteamet.' };
        case 'feilet':
            return { grad: Varseltype.Feil, melding: 'Utbetalingen feilet.' };
        default:
            return null;
    }
};

const utbetalingsvarsel = (tilstand: Tidslinjetilstand): VarselObject | null =>
    ['tilUtbetaling', 'utbetalt', 'revurdert'].includes(tilstand)
        ? { grad: Varseltype.Info, melding: 'Utbetalingen er sendt til oppdragsystemet.' }
        : ['tilUtbetalingAutomatisk', 'utbetaltAutomatisk'].includes(tilstand)
        ? { grad: Varseltype.Info, melding: 'Perioden er automatisk godkjent' }
        : null;

const vedtaksperiodeVenterVarsel = (tilstand: Tidslinjetilstand): VarselObject | null =>
    tilstand === 'venter'
        ? { grad: Varseltype.Info, melding: 'Ikke klar til behandling - avventer system' }
        : tilstand === 'venterPåKiling'
        ? { grad: Varseltype.Info, melding: 'Ikke klar for utbetaling. Avventer behandling av tidligere periode.' }
        : null;

const manglendeOppgavereferansevarsel = (tilstand: Tidslinjetilstand, oppgavereferanse?: string): VarselObject | null =>
    tilstand === 'oppgaver' && (!oppgavereferanse || oppgavereferanse.length === 0)
        ? {
              grad: Varseltype.Feil,
              melding: `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er 
              forsøkt utbetalt, men at det er forsinkelser i systemet.`,
          }
        : null;

const ukjentTilstandsvarsel = (tilstand: Tidslinjetilstand): VarselObject | null =>
    tilstand === 'ukjent'
        ? { grad: Varseltype.Feil, melding: 'Kunne ikke lese informasjon om sakens tilstand.' }
        : null;

const tildelingsvarsel = (saksbehandlerOid: string, tildeling?: Tildeling): VarselObject | null => {
    return tildeling && tildeling.saksbehandler.oid !== saksbehandlerOid
        ? {
              grad: Varseltype.Info,
              melding: `Saken er allerede tildelt til ${capitalizeName(tildeling?.saksbehandler.navn ?? '')}`,
          }
        : null;
};

interface SaksbildevarslerProps {
    aktivPeriode: Tidslinjeperiode;
    vedtaksperiode: Vedtaksperiode;
    saksbehandler: Saksbehandler;
    oppgavereferanse?: string;
    tildeling?: Tildeling;
}

export const Saksbildevarsler = ({
    aktivPeriode,
    vedtaksperiode,
    saksbehandler,
    oppgavereferanse,
    tildeling,
}: SaksbildevarslerProps) => {
    const infoVarsler: VarselObject[] = [
        tilstandInfoVarsel(aktivPeriode.tilstand),
        utbetalingsvarsel(aktivPeriode.tilstand),
        vedtaksperiodeVenterVarsel(aktivPeriode.tilstand),
        tildelingsvarsel(saksbehandler.oid, tildeling),
    ].filter((it) => it) as VarselObject[];

    const feilVarsler: VarselObject[] = [
        tilstandFeilVarsel(aktivPeriode.tilstand),
        ukjentTilstandsvarsel(aktivPeriode.tilstand),
        manglendeOppgavereferansevarsel(aktivPeriode.tilstand, oppgavereferanse),
    ].filter((it) => it) as VarselObject[];

    return (
        <div className="Saksbildevarsler">
            {infoVarsler.map(({ grad, melding }, index) => (
                <Saksbildevarsel type={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Saksbildevarsel>
            ))}
            <Aktivitetsloggvarsler varsler={vedtaksperiode.aktivitetslog} />
            {feilVarsler.map(({ grad, melding }, index) => (
                <Saksbildevarsel type={grad} key={index}>
                    <BodyShort>{melding}</BodyShort>
                </Saksbildevarsel>
            ))}
        </div>
    );
};
