import { Periodetype, Vedtaksperiode } from 'internal-types';
import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import '@navikt/helse-frontend-varsel/lib/main.css';

import { Tidslinjetilstand } from '../../../mapping/arbeidsgiver';
import { Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';

import { Aktivitetsloggvarsler } from './Aktivetsloggvarsler';

type VarselObject = {
    grad: Varseltype;
    melding: string;
};

const tilstandsvarsel = (tilstand: Tidslinjetilstand): VarselObject | null => {
    switch (tilstand) {
        case Tidslinjetilstand.KunFerie:
        case Tidslinjetilstand.KunPermisjon:
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
    [Tidslinjetilstand.TilUtbetaling, Tidslinjetilstand.Utbetalt].includes(tilstand)
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

const kandidatForAutomatiseringsvarsel = ({
    periodetype,
    aktivitetslog,
    automatiskBehandlet,
    behandlet,
}: Vedtaksperiode): VarselObject | null =>
    periodetype === Periodetype.Forlengelse && aktivitetslog.length === 0 && !automatiskBehandlet && !behandlet
        ? { grad: Varseltype.Info, melding: 'Kandidat for automatisering' }
        : null;

interface SaksbildevarslerProps {
    aktivPeriode: Tidslinjeperiode;
    vedtaksperiode: Vedtaksperiode;
    oppgavereferanse?: string;
}

export const Saksbildevarsler = ({ aktivPeriode, vedtaksperiode, oppgavereferanse }: SaksbildevarslerProps) => {
    const varsler: VarselObject[] = [
        tilstandsvarsel(aktivPeriode.tilstand),
        utbetalingsvarsel(aktivPeriode.tilstand),
        ukjentTilstandsvarsel(aktivPeriode.tilstand),
        manglendeOppgavereferansevarsel(aktivPeriode.tilstand, oppgavereferanse),
        kandidatForAutomatiseringsvarsel(vedtaksperiode),
        vedtaksperiodeVenterVarsel(aktivPeriode.tilstand),
    ].filter((it) => it) as VarselObject[];

    return (
        <>
            <Aktivitetsloggvarsler varsler={vedtaksperiode.aktivitetslog} />
            {varsler.map(({ grad, melding }, index) => (
                <Varsel type={grad} key={index}>
                    <Normaltekst>{melding}</Normaltekst>
                </Varsel>
            ))}
        </>
    );
};
