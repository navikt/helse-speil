import { useEffect } from 'react';

import {
    useGetOpptegnelseSekvensnummerSiste,
    useGetOpptegnelserForPerson,
} from '@io/rest/generated/opptegnelser/opptegnelser';
import { ApiOpptegnelse } from '@io/rest/generated/spesialist.schemas';
import { useMottaOpptegnelser, useNyesteOpptegnelseSekvens, useOpptegnelserPollingRate } from '@state/opptegnelser';

export const usePollEtterOpptegnelser = (personPseudoId: string) => {
    const mottaOpptegnelser = useMottaOpptegnelser();
    const pollInterval = useOpptegnelserPollingRate();
    const { data: sisteSekvensnummerData } = useGetOpptegnelseSekvensnummerSiste();
    const etterSekvensnummer = useNyesteOpptegnelseSekvens() ?? sisteSekvensnummerData?.data ?? 0;

    const { data } = useGetOpptegnelserForPerson(
        personPseudoId,
        { etterSekvensnummer: etterSekvensnummer },
        {
            query: {
                refetchInterval: pollInterval,
            },
        },
    );

    useEffect(() => {
        const opptegnelser: ApiOpptegnelse[] = data?.data ?? [];
        if (opptegnelser.length === 0) return;
        mottaOpptegnelser(opptegnelser);
    }, [data, mottaOpptegnelser]);
};
