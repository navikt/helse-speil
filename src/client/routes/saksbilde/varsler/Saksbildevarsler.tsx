import { Saksbehandler, Tidslinjetilstand, TildelingType, Vedtaksperiode } from 'internal-types';
import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Varseltype } from '@navikt/helse-frontend-varsel';
import '@navikt/helse-frontend-varsel/lib/main.css';

import { Tidslinjeperiode } from '../../../modell/utbetalingshistorikkelement';
import { capitalizeName } from '../../../utils/locale';

import { Aktivitetsloggvarsler } from './Aktivetsloggvarsler';
import { Saksbildevarsel } from './Saksbildevarsel';

type VarselObject = {
    grad: Varseltype;
    melding: string;
};

const tilstandInfoVarsel = (tilstand: Tidslinjetilstand): VarselObject | null => {
    switch (tilstand) {
        case Tidslinjetilstand.KunFerie:
        case Tidslinjetilstand.KunPermisjon:
        case Tidslinjetilstand.RevurdertIngenUtbetaling:
        case Tidslinjetilstand.IngenUtbetaling:
            return { grad: Varseltype.Info, melding: 'Perioden er godkjent, ingen utbetaling.' };
        case Tidslinjetilstand.Revurderes:
            return { grad: Varseltype.Info, melding: 'Revurdering er igangsatt og må fullføres.' };
        case Tidslinjetilstand.Annullert:
            return { grad: Varseltype.Info, melding: 'Utbetalingen er annullert.' };
        case Tidslinjetilstand.TilAnnullering:
            return { grad: Varseltype.Info, melding: 'Annullering venter.' };
        default:
            return null;
    }
};

const tilstandFeilVarsel = (tilstand: Tidslinjetilstand): VarselObject | null => {
    switch (tilstand) {
        case Tidslinjetilstand.AnnulleringFeilet:
            return { grad: Varseltype.Feil, melding: 'Annulleringen feilet. Kontakt utviklerteamet.' };
        case Tidslinjetilstand.Feilet:
            return { grad: Varseltype.Feil, melding: 'Utbetalingen feilet.' };
        default:
            return null;
    }
};

const utbetalingsvarsel = (tilstand: Tidslinjetilstand): VarselObject | null =>
    [Tidslinjetilstand.TilUtbetaling, Tidslinjetilstand.Utbetalt, Tidslinjetilstand.Revurdert].includes(tilstand)
        ? { grad: Varseltype.Info, melding: 'Utbetalingen er sendt til oppdragsystemet.' }
        : [Tidslinjetilstand.TilUtbetalingAutomatisk, Tidslinjetilstand.UtbetaltAutomatisk].includes(tilstand)
        ? { grad: Varseltype.Info, melding: 'Perioden er automatisk godkjent' }
        : null;

const vedtaksperiodeVenterVarsel = (tilstand: Tidslinjetilstand): VarselObject | null =>
    tilstand === Tidslinjetilstand.Venter
        ? { grad: Varseltype.Info, melding: 'Ikke klar til behandling - avventer system' }
        : tilstand === Tidslinjetilstand.VenterPåKiling
        ? { grad: Varseltype.Info, melding: 'Ikke klar for utbetaling. Avventer behandling av tidligere periode.' }
        : null;

const manglendeOppgavereferansevarsel = (tilstand: Tidslinjetilstand, oppgavereferanse?: string): VarselObject | null =>
    tilstand === Tidslinjetilstand.Oppgaver && (!oppgavereferanse || oppgavereferanse.length === 0)
        ? {
              grad: Varseltype.Feil,
              melding: `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er 
              forsøkt utbetalt, men at det er forsinkelser i systemet.`,
          }
        : null;

const ukjentTilstandsvarsel = (tilstand: Tidslinjetilstand): VarselObject | null =>
    tilstand === Tidslinjetilstand.Ukjent
        ? { grad: Varseltype.Feil, melding: 'Kunne ikke lese informasjon om sakens tilstand.' }
        : null;

const tildelingsvarsel = (saksbehandlerOid: string, tildeling?: TildelingType): VarselObject | null => {
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
    tildeling?: TildelingType;
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
                    <Normaltekst>{melding}</Normaltekst>
                </Saksbildevarsel>
            ))}
            <Aktivitetsloggvarsler varsler={vedtaksperiode.aktivitetslog} />
            {feilVarsler.map(({ grad, melding }, index) => (
                <Saksbildevarsel type={grad} key={index}>
                    <Normaltekst>{melding}</Normaltekst>
                </Saksbildevarsel>
            ))}
        </div>
    );
};
