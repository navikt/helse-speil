import { useParams } from 'react-router';
import { Scopes, useUpdateVarsler } from '../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import { useLayoutEffect } from 'react';
import { useHentPerson } from '../state/person';

export const erGyldigPersonId = (value: string) => value.match(/^\d{1,15}$/) !== null;

export const useRefreshPerson = () => {
    const { aktorId } = useParams<{ aktorId: string }>();
    const { leggTilVarsel } = useUpdateVarsler();
    const hentPerson = useHentPerson();

    useLayoutEffect(() => {
        if (erGyldigPersonId(aktorId)) {
            hentPerson(aktorId);
        } else {
            leggTilVarsel({
                message: `'${aktorId}' er ikke en gyldig aktør-ID.`,
                scope: Scopes.SAKSBILDE,
                type: Varseltype.Feil,
            });
        }
    }, [aktorId]);
};
