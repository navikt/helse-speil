import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { OpptegnelserDocument } from '../graphql';
import { useMottaOpptegnelser, useNyesteOpptegnelseSekvens, useOpptegnelserPollingRate } from '../../state/opptegnelser';

export const usePollEtterOpptegnelser = () => {
    const mottaOpptegnelser = useMottaOpptegnelser();
    const sekvensId = useNyesteOpptegnelseSekvens();
    const pollInterval = useOpptegnelserPollingRate();
    const { data } = useQuery(OpptegnelserDocument, {
        variables: {
            sekvensId,
        },
        pollInterval,
        onError: (error) => {
            console.error(error);
        },
    });

    useEffect(() => {
        const opptegnelser = data?.opptegnelser ?? [];
        if (opptegnelser.length === 0) return;
        mottaOpptegnelser(
            opptegnelser.map((opptegnelse) => ({
                sekvensnummer: opptegnelse.sekvensnummer,
                type: opptegnelse.type,
                aktørId: Number.parseInt(opptegnelse.aktorId),
                payload: opptegnelse.payload,
            })),
        );
    }, [data]);
};
