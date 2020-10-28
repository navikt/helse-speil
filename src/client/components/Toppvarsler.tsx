import React, { useContext } from 'react';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { PersonContext } from '../context/PersonContext';
import { Periodetype } from 'internal-types';
import '@navikt/helse-frontend-varsel/lib/main.css';

export const Toppvarsler = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { aktivitetslog, periodetype, automatiskBehandlet } = aktivVedtaksperiode!;

    const erKandidatForAutomatisering = () =>
        periodetype === Periodetype.Forlengelse && aktivitetslog.length === 0 && !automatiskBehandlet;

    return (
        <>
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
