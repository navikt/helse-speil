import { getOppgavereferanse, getOpptegnelser } from './http';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import {
    nyeOpptegnelserState,
    opptegnelsePollingTimeState,
    sisteSekvensIdOpptegnelseState,
} from '../state/opptegnelser';
import { useEffect } from 'react';

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms));

export const pollEtterNyOppgave = async (
    fødselsnummer: string,
    oppgavereferanse: string,
    timeout: number = 1000
): Promise<void> => {
    for (let _ = 0; _ < 10; _++) {
        await delay(timeout);
        const nyOppgavereferanse = await getOppgavereferanse(fødselsnummer)
            .then((response) => response.data.oppgavereferanse)
            .catch((error) => {
                if (error.statusCode >= 500) {
                    console.error(error);
                }
            });

        if (nyOppgavereferanse && nyOppgavereferanse !== oppgavereferanse) {
            return Promise.resolve();
        }
    }
    return Promise.reject();
};

export const usePollEtterOpptegnelser = () => {
    const setOpptegnelser = useSetRecoilState(nyeOpptegnelserState);
    const sisteSekvensId = useRecoilValue(sisteSekvensIdOpptegnelseState);
    const opptegnelsePollingTime = useRecoilValue(opptegnelsePollingTimeState);
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
