import { NetworkStatus } from '@apollo/client';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser } from '@state/opptegnelser';
import { useSelectPeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';

export const useRefreshPersonVedOpptegnelse = () => {
    const { data, networkStatus, refetch } = useFetchPersonQuery();
    const selectPeriod = useSelectPeriod();

    useHåndterOpptegnelser(async (opptegnelse) => {
        if (
            data !== undefined &&
            data.person?.aktorId &&
            opptegnelse.aktørId.toString() === data.person.aktorId &&
            !(networkStatus in [NetworkStatus.loading, NetworkStatus.refetch])
        ) {
            await refetch();
            if (erOpptegnelseForNyOppgave(opptegnelse)) selectPeriod(data.person);
        }
    });
};
