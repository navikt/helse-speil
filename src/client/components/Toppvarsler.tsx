import React, { useContext } from 'react';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import { PersonContext } from '../context/PersonContext';

const Toppvarsler = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { vilkår, aktivitetslog } = aktivVedtaksperiode!;

    const alleVilkårOppfylt = () => vilkår === undefined || Object.values(vilkår).find(v => !v?.oppfylt) === undefined;

    return (
        <>
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
