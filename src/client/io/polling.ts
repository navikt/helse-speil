import { useEffect } from 'react';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

import {
    nyesteOpptegnelserState,
    opptegnelsePollingTimeState,
    sisteSekvensIdOpptegnelseState,
    useOpptegnelserPollingRate,
} from '../state/opptegnelser';

import { getOpptegnelser } from './http';

export const usePollEtterOpptegnelser = () => {
    const setOpptegnelser = useSetRecoilState(nyesteOpptegnelserState);
    const sisteSekvensId = useRecoilValue(sisteSekvensIdOpptegnelseState);
    const opptegnelsePollingTime = useOpptegnelserPollingRate();
    const resetPollefrekvens = useResetRecoilState(opptegnelsePollingTimeState);

    useEffect(() => {
        function tick() {
            getOpptegnelser(sisteSekvensId)
                .then((response) => {
                    if (response.data.length > 0) {
                        setOpptegnelser(response.data);
                        resetPollefrekvens();
                    }
                })
                .catch((error) => {
                    if (error.statusCode >= 500) {
                        console.error(error);
                    }
                });
        }
        let id = setInterval(tick, opptegnelsePollingTime);
        return () => clearInterval(id);
    }, [opptegnelsePollingTime, sisteSekvensId]);
};
