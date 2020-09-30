import React, { useContext } from 'react';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { PersonContext } from '../context/PersonContext';
import { Periodetype, Vedtaksperiodetilstand } from 'internal-types';
import '@navikt/helse-frontend-varsel/lib/main.css';

const Toppvarsler = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { vilkår, aktivitetslog, periodetype, automatiskBehandlet, tilstand } = aktivVedtaksperiode!;

    const alleVilkårOppfylt = () =>
        vilkår === undefined || Object.values(vilkår).find((v) => !v?.oppfylt) === undefined;

    const erKandidatForAutomatisering = () =>
        periodetype === Periodetype.Forlengelse &&
        aktivitetslog.length === 0 &&
        !(automatiskBehandlet);

    return (
        <>
            {erKandidatForAutomatisering() && <Varsel type={Varseltype.Info}>Kandidat for automatisering</Varsel>}
            {automatiskBehandlet && <Varsel type={Varseltype.Info}>Perioden er automatisk godkjent</Varsel>}
            {!alleVilkårOppfylt() && <Varsel type={Varseltype.Feil}>Vilkår er ikke oppfylt i deler av perioden</Varsel>}
            {aktivitetslog.length > 0 &&
            aktivitetslog.map((aktivitet, index) => (
                <Varsel type={Varseltype.Advarsel} key={index}>
                    {aktivitet.melding}
                </Varsel>
            ))}
        </>
    );
};

export default Toppvarsler;
