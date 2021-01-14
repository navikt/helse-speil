import React from 'react';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { Periodetype, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import '@navikt/helse-frontend-varsel/lib/main.css';

interface ToppvarslerProps {
    vedtaksperiode: Vedtaksperiode;
}

type VarselObject = {
    grad: Varseltype;
    melding: string;
};

const tilstandsvarsel = ({ tilstand }: Vedtaksperiode): VarselObject | null => {
    switch (tilstand) {
        case Vedtaksperiodetilstand.KunFerie:
        case Vedtaksperiodetilstand.IngenUtbetaling:
            return { grad: Varseltype.Info, melding: 'Perioden er godkjent, ingen utbetaling.' };
        case Vedtaksperiodetilstand.Feilet:
            return { grad: Varseltype.Feil, melding: 'Utbetalingen feilet.' };
        case Vedtaksperiodetilstand.Annullert:
        case Vedtaksperiodetilstand.Avslag:
            return { grad: Varseltype.Info, melding: 'Utbetalingen er sendt til annullering.' };
        case Vedtaksperiodetilstand.TilAnnullering:
            return { grad: Varseltype.Info, melding: 'Annullerer perioden.' };
        case Vedtaksperiodetilstand.AnnulleringFeilet:
            return { grad: Varseltype.Feil, melding: 'Annullering feilet. Vennligst kontakt utvikler.' };
        default:
            return null;
    }
};

const utbetalingsvarsel = ({ tilstand, automatiskBehandlet }: Vedtaksperiode): VarselObject | null =>
    [Vedtaksperiodetilstand.TilUtbetaling, Vedtaksperiodetilstand.Utbetalt].includes(tilstand) && !automatiskBehandlet
        ? { grad: Varseltype.Info, melding: 'Utbetalingen er sendt til oppdragsystemet.' }
        : null;

const manglendeOppgavereferansevarsel = ({ tilstand, oppgavereferanse }: Vedtaksperiode): VarselObject | null =>
    tilstand === Vedtaksperiodetilstand.Oppgaver && (!oppgavereferanse || oppgavereferanse.length === 0)
        ? {
              grad: Varseltype.Feil,
              melding: `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er 
              forsøkt utbetalt, men at det er forsinkelser i systemet.`,
          }
        : null;

const ukjentTilstandsvarsel = ({ tilstand }: Vedtaksperiode): VarselObject | null =>
    !Object.values(Vedtaksperiodetilstand).includes(tilstand)
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

const automatiskBehandletvarsel = ({ automatiskBehandlet }: Vedtaksperiode): VarselObject | null =>
    automatiskBehandlet ? { grad: Varseltype.Info, melding: 'Perioden er automatisk godkjent' } : null;

export const Toppvarsler = ({ vedtaksperiode }: ToppvarslerProps) => {
    const varsler: VarselObject[] = [
        tilstandsvarsel(vedtaksperiode),
        utbetalingsvarsel(vedtaksperiode),
        ukjentTilstandsvarsel(vedtaksperiode),
        automatiskBehandletvarsel(vedtaksperiode),
        manglendeOppgavereferansevarsel(vedtaksperiode),
        kandidatForAutomatiseringsvarsel(vedtaksperiode),
    ].filter((it) => it) as VarselObject[];

    return (
        <>
            {vedtaksperiode.aktivitetslog.map((aktivitet, index) => (
                <Varsel type={Varseltype.Advarsel} key={index}>
                    {aktivitet}
                </Varsel>
            ))}
            {varsler.map(({ grad, melding }, index) => (
                <Varsel type={grad} key={index}>
                    {melding}
                </Varsel>
            ))}
        </>
    );
};
