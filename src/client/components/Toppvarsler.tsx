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

    const erTilAnnullering = () => tilstand === Vedtaksperiodetilstand.TilAnnullering;

    const erAnnulleringFeilet = () => tilstand === Vedtaksperiodetilstand.AnnulleringFeilet;

    return (
        <>
            {erAnnulleringFeilet() && (
                <Varsel type={Varseltype.Feil}>Annullering feilet. Vennligst kontakt utvikler.</Varsel>
            )}
            {erTilAnnullering() && <Varsel type={Varseltype.Info}>Annullerer perioden</Varsel>}
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
