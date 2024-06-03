import { useQuery, useReadQuery } from '@apollo/client';
import { useNavigation } from '@hooks/useNavigation';
import { FetchPersonDocument } from '@io/graphql';

export const useCurrentPerson = (): FetchedPerson => {
    const { data } = useFetchPersonQuery();
    return data?.person as FetchedPerson;
};

const useFinnFødselsnummerForValgtPerson = (aktorId: string | undefined): string | undefined => {
    const cacheRead = useQuery(FetchPersonDocument, {
        fetchPolicy: 'cache-only',
        variables: { aktorId: aktorId },
    });

    return cacheRead.data?.person?.fodselsnummer;
};

export const useFetchPersonQuery = (force: boolean = false) => {
    // Henter aktørId fra URL, slik at personen er tilgjengelig utenfor saksbilde-routen også
    const { aktørId: aktorId } = useNavigation();

    // Hvis vi har fødselsnummeret for personen man er inne på, sender vi det i stedet, for å unngå at kallet feiler i
    // spesialist for personer med flere identer.
    const fnr = useFinnFødselsnummerForValgtPerson(aktorId);
    const variables = fnr ? { fnr } : { aktorId };

    const harIdentifikator = aktorId != null || fnr != null;
    return useQuery(FetchPersonDocument, {
        fetchPolicy: force ? 'cache-first' : 'cache-only',
        variables,
        skip: !harIdentifikator,
    });
};
