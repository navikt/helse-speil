import { useLazyQuery, useQuery } from '@apollo/client';
import { useNavigation } from '@hooks/useNavigation';
import { FetchPersonDocument } from '@io/graphql';

export const useCurrentPerson = (): FetchedPerson => {
    const { data } = useFetchPersonQuery();
    return data?.person as FetchedPerson;
};

export const useFetchPersonQuery = (force: boolean = false) => {
    // Henter aktørId fra URL, slik at personen er tilgjengelig utenfor saksbilde-routen også
    const { aktørId: aktorId } = useNavigation();
    return useQuery(FetchPersonDocument, {
        fetchPolicy: force ? 'cache-first' : 'cache-only',
        variables: { aktorId },
        skip: aktorId == null,
    });
};
export const useLazyFetchPersonQuery = () => {
    // Henter aktørId fra URL, slik at personen er tilgjengelig utenfor saksbilde-routen også
    const { aktørId: aktorId } = useNavigation();
    return useLazyQuery(FetchPersonDocument, {
        variables: { aktorId },
    });
};
