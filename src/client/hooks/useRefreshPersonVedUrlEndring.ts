import { useParams } from 'react-router';
import { Scopes, useUpdateVarsler } from '../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import { useLayoutEffect } from 'react';
import { useHentPerson, usePerson } from '../state/person';

export const erGyldigPersonId = (value: string) => value.match(/^\d{1,15}$/) !== null;

export const useRefreshPersonVedUrlEndring = () => {
    const { aktorId } = useParams<{ aktorId: string }>();
    const { leggTilVarsel } = useUpdateVarsler();
    const hentPerson = useHentPerson();
    const person = usePerson();

    useLayoutEffect(() => {
        if (aktorId && erGyldigPersonId(aktorId)) {
            (person === undefined || person?.aktørId !== aktorId) && hentPerson(aktorId);
        } else {
            leggTilVarsel({
                message: `'${aktorId}' er ikke en gyldig aktør-ID/fødselsnummer.`,
                scope: Scopes.SAKSBILDE,
                type: Varseltype.Feil,
            });
        }
    }, [aktorId]);
};
