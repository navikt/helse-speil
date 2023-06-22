import { useEffect } from 'react';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

import {
    nyesteOpptegnelserState,
    opptegnelsePollingTimeState,
    sisteSekvensIdOpptegnelseState,
    useOpptegnelserPollingRate,
} from '@state/opptegnelser';

import { SpeilResponse, getOpptegnelser } from './http';

export const usePollEtterOpptegnelser = () => {
    const setOpptegnelser = useSetRecoilState(nyesteOpptegnelserState);
    const sisteSekvensId = useRecoilValue(sisteSekvensIdOpptegnelseState);
    const opptegnelsePollingTime = useOpptegnelserPollingRate();
    const resetPollefrekvens = useResetRecoilState(opptegnelsePollingTimeState);

    useEffect(() => {
        function tick() {
            getOpptegnelser(sisteSekvensId)
                .then(({ data }: SpeilResponse<Array<Opptegnelse>>) => {
                    if (data && data.length > 0) {
                        setOpptegnelser(data);
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
