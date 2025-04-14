import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { OpptegnelserDocument } from '@io/graphql/index';
import { useMottaOpptegnelser, useNyesteOpptegnelseSekvens, useOpptegnelserPollingRate } from '@state/opptegnelser';

export const usePollEtterOpptegnelser = () => {
    const mottaOpptegnelser = useMottaOpptegnelser();
    const sekvensId = useNyesteOpptegnelseSekvens();
    const pollInterval = useOpptegnelserPollingRate();
    const { data, startPolling } = useQuery(OpptegnelserDocument, {
        variables: {
            sekvensId,
        },
        pollInterval: 0, // Ikke start pollingen ennå, fordi vi ikke trenger å hente opptegnelser når vi nettopp har hentet personen
    });
    // Start pollingen manuelt, da gjør apollo første kall *etter* pollInterval, i stedet for at kallet til opptegnelser
    // går *samtidig* som personen hentes når man går inn på saksbildet, som ikke gir noen funksjonell mening.
    startPolling(pollInterval);

    useEffect(() => {
        const opptegnelser = data?.opptegnelser ?? [];
        if (opptegnelser.length === 0) return;
        mottaOpptegnelser(opptegnelser);
    }, [data, mottaOpptegnelser]);
};
