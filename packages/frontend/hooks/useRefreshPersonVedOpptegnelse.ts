import { useHåndterOpptegnelser } from '@state/opptegnelser';
import { useFetchPersonQuery } from '@state/person';

export const useRefreshPersonVedOpptegnelse = () => {
    const { data, refetch } = useFetchPersonQuery();
    useHåndterOpptegnelser((opptegnelse) => {
        if (data !== undefined && data.person?.aktorId && opptegnelse.aktørId.toString() === data.person.aktorId) {
            void refetch();
        }
    });
};
