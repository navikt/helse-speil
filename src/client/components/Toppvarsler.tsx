import React, { useContext } from 'react';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { PersonContext } from '../context/PersonContext';
import { Periodetype } from 'internal-types';
import '@navikt/helse-frontend-varsel/lib/main.css';
import { institusjonsoppholdOppfylt } from '../routes/SaksbildeV2/Vilkår/useKategoriserteVilkår';

export const Toppvarsler = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    if (!aktivVedtaksperiode) return null;

    const { aktivitetslog, periodetype, automatiskBehandlet } = aktivVedtaksperiode!;

    const erKandidatForAutomatisering = () =>
        periodetype === Periodetype.Forlengelse && aktivitetslog.length === 0 && !automatiskBehandlet;

    const måSjekkeInstitusjonsopphold = () => !institusjonsoppholdOppfylt(aktivVedtaksperiode.godkjenttidspunkt);

    return (
        <>
            {erKandidatForAutomatisering() && <Varsel type={Varseltype.Info}>Kandidat for automatisering</Varsel>}
            {automatiskBehandlet && <Varsel type={Varseltype.Info}>Perioden er automatisk godkjent</Varsel>}
            {måSjekkeInstitusjonsopphold() && (
                <Varsel type={Varseltype.Advarsel}>
                    Institusjonsopphold er ikke sjekket automatisk, må vurderes manuelt
                </Varsel>
            )}
            {aktivitetslog.length > 0 &&
                aktivitetslog.map((aktivitet, index) => (
                    <Varsel type={Varseltype.Advarsel} key={index}>
                        {aktivitet}
                    </Varsel>
                ))}
        </>
    );
};
