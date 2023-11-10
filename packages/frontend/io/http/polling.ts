import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
    nyesteOpptegnelserState,
    sisteSekvensIdOpptegnelseState,
    useOpptegnelserPollingRate,
    useResetOpptegnelsePollingRate,
    useSetOpptegnelserNy,
} from '@state/opptegnelser';

import { SpeilResponse, getOpptegnelser } from './http';

export const usePollEtterOpptegnelser = () => {
    const setOpptegnelser = useSetRecoilState(nyesteOpptegnelserState);
    const setOpptegnelserNy = useSetOpptegnelserNy();
    const sisteSekvensId = useRecoilValue(sisteSekvensIdOpptegnelseState);
    const opptegnelsePollingTime = useOpptegnelserPollingRate();
    const resetPollefrekvens = useResetOpptegnelsePollingRate();

    useEffect(() => {
        function tick() {
            getOpptegnelser(sisteSekvensId)
                .then(({ data }: SpeilResponse<Array<Opptegnelse>>) => {
                    if (data && data.length > 0) {
                        setOpptegnelser(data);
                        setOpptegnelserNy(data);
                        resetPollefrekvens();
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
