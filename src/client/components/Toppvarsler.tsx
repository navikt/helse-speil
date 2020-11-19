import React, { useContext } from 'react';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { PersonContext } from '../context/PersonContext';
import { Periodetype, Vedtaksperiodetilstand } from 'internal-types';
import '@navikt/helse-frontend-varsel/lib/main.css';

export const Toppvarsler = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    if (!aktivVedtaksperiode) return null;

    const { aktivitetslog, periodetype, automatiskBehandlet, behandlet, tilstand } = aktivVedtaksperiode!;

    const erKandidatForAutomatisering = () =>
        periodetype === Periodetype.Forlengelse && aktivitetslog.length === 0 && !automatiskBehandlet && !behandlet;

    const harOppgavereferanse = aktivVedtaksperiode.oppgavereferanse && aktivVedtaksperiode.oppgavereferanse !== '';

    const aktivVedtaksperiodeTilstandVarsel = (tilstand: Vedtaksperiodetilstand) => {
        switch (tilstand) {
            case Vedtaksperiodetilstand.TilUtbetaling:
            case Vedtaksperiodetilstand.Utbetalt:
                return !automatiskBehandlet ? (
                    <Varsel type={Varseltype.Info}>Utbetalingen er sendt til oppdragsystemet.</Varsel>
                ) : null;
            case Vedtaksperiodetilstand.KunFerie:
            case Vedtaksperiodetilstand.IngenUtbetaling:
                return <Varsel type={Varseltype.Info}>Perioden er godkjent, ingen utbetaling.</Varsel>;
            case Vedtaksperiodetilstand.Feilet:
                return <Varsel type={Varseltype.Feil}>Utbetalingen feilet.</Varsel>;
            case Vedtaksperiodetilstand.Annullert:
            case Vedtaksperiodetilstand.Avslag:
                return <Varsel type={Varseltype.Info}>Utbetalingen er sendt til annullering.</Varsel>;
            case Vedtaksperiodetilstand.TilAnnullering:
                return <Varsel type={Varseltype.Info}>Annullerer perioden</Varsel>;
            case Vedtaksperiodetilstand.AnnulleringFeilet:
                return <Varsel type={Varseltype.Feil}>Annullering feilet. Vennligst kontakt utvikler.</Varsel>;
            case Vedtaksperiodetilstand.Oppgaver:
                return harOppgavereferanse ? null : (
                    <Varsel type={Varseltype.Feil}>
                        Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er forsøkt utbetalt, men at
                        det er forsinkelser i systemet.
                    </Varsel>
                );
            default:
                return <Varsel type={Varseltype.Feil}>Kunne ikke lese informasjon om sakens tilstand.</Varsel>;
        }
    };

    return (
        <>
            {aktivVedtaksperiodeTilstandVarsel(tilstand)}
            {erKandidatForAutomatisering() && <Varsel type={Varseltype.Info}>Kandidat for automatisering</Varsel>}
            {automatiskBehandlet && <Varsel type={Varseltype.Info}>Perioden er automatisk godkjent</Varsel>}
            {aktivitetslog.length > 0 &&
                aktivitetslog.map((aktivitet, index) => (
                    <Varsel type={Varseltype.Advarsel} key={index}>
                        {aktivitet}
                    </Varsel>
                ))}
        </>
    );
};
