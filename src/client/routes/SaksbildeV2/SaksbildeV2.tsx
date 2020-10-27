import React, { useContext, useEffect } from 'react';
import { PersonContext } from '../../context/PersonContext';
import { Personlinje } from '../../components/Personlinje';
import { useParams } from 'react-router-dom';
import { Scopes, useUpdateVarsler } from '../../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import { Tidslinje } from '../../components/tidslinje';

const useRefetchPersonOnUrlChange = () => {
    const { aktorId } = useParams();
    const { hentPerson } = useContext(PersonContext);
    const { leggTilVarsel } = useUpdateVarsler();

    useEffect(() => {
        const aktørId = aktorId.match(/^\d{1,15}$/);
        if (!aktørId) {
            leggTilVarsel({
                message: `'${aktorId}' er ikke en gyldig aktør-ID.`,
                scope: Scopes.SAKSBILDE,
                type: Varseltype.Feil,
            });
        } else {
            hentPerson(aktørId[0]);
        }
    }, [aktorId]);
};

export const SaksbildeV2 = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);

    useRefetchPersonOnUrlChange();

    if (!aktivVedtaksperiode || !personTilBehandling) return <div />;

    return (
        <div>
            <Personlinje person={personTilBehandling} />
            <Tidslinje person={personTilBehandling} aktivVedtaksperiode={aktivVedtaksperiode} />
        </div>
    );
};
