import { useRecoilValue } from 'recoil';

import { useQuery } from '@apollo/client';
import { useNavigation } from '@hooks/useNavigation';
import { FetchPersonDocument, Tildeling } from '@io/graphql';
import { TildelingStateType, tildelingState } from '@state/tildeling';

export const useCurrentPerson = () => {
    const { data } = useFetchPersonQuery();
    const tildelinger = useRecoilValue(tildelingState);
    return personMedTildeling(tildelinger, data?.person);
};

const personMedTildeling = (tildelinger: TildelingStateType, person: FetchPersonQuery['person']) => {
    if (!person) return null;
    const tildeling = finnTildeling(tildelinger, person);
    return {
        ...person,
        tildeling: tildeling ? { ...tildeling } : null,
    } as FetchedPerson;
};

const finnTildeling = (tildelinger: TildelingStateType, person: NonNullable<FetchPersonQuery['person']>) => {
    const tildelingOverlay: Tildeling | null | undefined = tildelinger[person.aktorId];
    return tildelingOverlay !== undefined ? tildelingOverlay : person?.tildeling;
};

export const useFetchPersonQuery = () => {
    // Henter aktørId fra URL, slik at personen er tilgjengelig utenfor saksbilde-routen også
    const { aktørId: aktorId } = useNavigation();
    return useQuery(FetchPersonDocument, {
        variables: { aktorId },
        skip: aktorId == null,
    });
};
