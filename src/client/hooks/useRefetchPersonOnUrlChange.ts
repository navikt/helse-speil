import { useParams } from 'react-router';
import { useContext, useEffect } from 'react';
import { PersonContext } from '../context/PersonContext';
import { Scopes, useUpdateVarsler } from '../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';

export const useRefetchPersonOnUrlChange = () => {
    const { aktorId } = useParams<{ aktorId: string }>();
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
