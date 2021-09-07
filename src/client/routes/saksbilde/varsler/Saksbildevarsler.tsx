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

const tilstandsvarsel = (tilstand: Tidslinjetilstand): VarselObject | null => {
    switch (tilstand) {
        case Tidslinjetilstand.KunFerie:
        case Tidslinjetilstand.KunPermisjon:
        case Tidslinjetilstand.RevurdertIngenUtbetaling:
        case Tidslinjetilstand.IngenUtbetaling:
            return { grad: Varseltype.Info, melding: 'Perioden er godkjent, ingen utbetaling.' };
        case Tidslinjetilstand.Feilet:
            return { grad: Varseltype.Feil, melding: 'Utbetalingen feilet.' };
        case Tidslinjetilstand.Annullert:
            return { grad: Varseltype.Info, melding: 'Utbetalingen er annullert.' };
        case Tidslinjetilstand.TilAnnullering:
            return { grad: Varseltype.Info, melding: 'Annullering venter.' };
        case Tidslinjetilstand.AnnulleringFeilet:
            return { grad: Varseltype.Feil, melding: 'Annulleringen feilet. Kontakt utviklerteamet.' };
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
    const varsler: VarselObject[] = [
        tilstandsvarsel(aktivPeriode.tilstand),
        utbetalingsvarsel(aktivPeriode.tilstand),
        ukjentTilstandsvarsel(aktivPeriode.tilstand),
        manglendeOppgavereferansevarsel(aktivPeriode.tilstand, oppgavereferanse),
        vedtaksperiodeVenterVarsel(aktivPeriode.tilstand),
        tildelingsvarsel(saksbehandler.oid, tildeling),
    ].filter((it) => it) as VarselObject[];

    return (
        <div className="Saksbildevarsler">
            {aktivPeriode.tilstand === Tidslinjetilstand.Revurderes && (
                <Saksbildevarsel type={Varseltype.Info}>
                    <Normaltekst>Revurdering er igangsatt og må fullføres.</Normaltekst>
                </Saksbildevarsel>
            )}
            <Aktivitetsloggvarsler varsler={vedtaksperiode.aktivitetslog} />
            {varsler.map(({ grad, melding }, index) => (
                <Saksbildevarsel type={grad} key={index}>
                    <Normaltekst>{melding}</Normaltekst>
                </Saksbildevarsel>
            ))}
        </div>
    );
};
