import React from 'react';
import {Varsel, Varseltype} from '@navikt/helse-frontend-varsel';
import {Periodetype, Vedtaksperiode, Vedtaksperiodetilstand} from 'internal-types';
import '@navikt/helse-frontend-varsel/lib/main.css';
import {Aktivitetsloggvarsler} from './Aktivetsloggvarsler';
import {Normaltekst} from 'nav-frontend-typografi';

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
            return { grad: Varseltype.Info, melding: 'Utbetalingen er annullert.' };
        case Vedtaksperiodetilstand.TilAnnullering:
            return { grad: Varseltype.Info, melding: 'Annullering venter.' };
        case Vedtaksperiodetilstand.AnnulleringFeilet:
            return { grad: Varseltype.Feil, melding: 'Annulleringen feilet. Kontakt utviklerteamet.' };
        default:
            return null;
    }
};

const utbetalingsvarsel = ({ tilstand, automatiskBehandlet }: Vedtaksperiode): VarselObject | null =>
    [Vedtaksperiodetilstand.TilUtbetaling, Vedtaksperiodetilstand.Utbetalt].includes(tilstand) && !automatiskBehandlet
        ? { grad: Varseltype.Info, melding: 'Utbetalingen er sendt til oppdragsystemet.' }
        : null;

const vedtaksperiodeVenterVarsel = ({ tilstand, oppgavereferanse }: Vedtaksperiode): boolean =>
    tilstand === Vedtaksperiodetilstand.Venter;

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
            {vedtaksperiodeVenterVarsel(vedtaksperiode) && (
                <Varsel type={Varseltype.Info}>
                    <Normaltekst>Ikke klar til behandling - avventer system</Normaltekst>
                </Varsel>
            )}
            <Aktivitetsloggvarsler varsler={vedtaksperiode.aktivitetslog} />
            {varsler.map(({ grad, melding }, index) => (
                <Varsel type={grad} key={index}>
                    <Normaltekst>{melding}</Normaltekst>
                </Varsel>
            ))}
        </>
    );
};
