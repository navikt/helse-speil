import { NetworkStatus } from '@apollo/client';
import { useHåndterOpptegnelser } from '@state/opptegnelser';
import { useFetchPersonQuery } from '@state/person';

export const useRefreshPersonVedOpptegnelse = () => {
    const { data, networkStatus, refetch } = useFetchPersonQuery();
    useHåndterOpptegnelser((opptegnelse) => {
        if (
            data !== undefined &&
            data.person?.aktorId &&
            opptegnelse.aktørId.toString() === data.person.aktorId &&
            !(networkStatus in [NetworkStatus.loading, NetworkStatus.refetch])
        ) {
            void refetch();
        }
    });
};
