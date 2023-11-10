import { useEffect } from 'react';

import { useMottaOpptegnelser, useNyesteOpptegnelseSekvens, useOpptegnelserPollingRate } from '@state/opptegnelser';

import { SpeilResponse, getOpptegnelser } from './http';

export const usePollEtterOpptegnelser = () => {
    const mottaOpptegnelser = useMottaOpptegnelser();
    const sisteSekvensId = useNyesteOpptegnelseSekvens();
    const opptegnelsePollingTime = useOpptegnelserPollingRate();

    useEffect(() => {
        function tick() {
            getOpptegnelser(sisteSekvensId)
                .then(({ data }: SpeilResponse<Array<Opptegnelse>>) => {
                    if (data && data.length > 0) {
                        mottaOpptegnelser(data);
                    }
                })
                .catch((error) => {
                    if (error.statusCode === 401) clearInterval(id);
                    else if (error.statusCode >= 500) {
                        console.error(error);
                    }
                });
        }

        const id = setInterval(tick, opptegnelsePollingTime);
        return () => clearInterval(id);
    }, [opptegnelsePollingTime, sisteSekvensId]);
};
