import { useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { useDebouncedCallback } from 'use-debounce';

import { Opptegnelse } from '@io/graphql';

const opptegnelsePollingTimeState = atom<number>({
    key: 'opptegnelsePollingTimeState',
    default: 5_000,
});

const nyesteOpptegnelserState = atom<Opptegnelse[]>({
    key: 'nyesteOpptegnelserState',
    default: [],
});

const nyesteOpptegnelseSekvensIdState = atom<number | undefined>({
    key: 'nyesteOpptegnelseSekvensIdState',
    default: undefined,
});

export const useHåndterOpptegnelser = (onOpptegnelseCallback: (o: Opptegnelse) => void) => {
    const opptegnelser = useRecoilValue(nyesteOpptegnelserState);
    const resetOpptegnelser = useResetRecoilState(nyesteOpptegnelserState);
    useEffect(() => {
        if (opptegnelser.length > 0) {
            opptegnelser.forEach((o) => onOpptegnelseCallback(o));
            resetOpptegnelser();
        }
    }, [onOpptegnelseCallback, opptegnelser, resetOpptegnelser]);
};

export const useMottaOpptegnelser = () => {
    const setOpptegnelser = useSetOpptegnelser();
    const setOpptegnelserSekvensId = useSetNyesteOpptegnelseSekvens();
    const resetPollefrekvens = useResetRecoilState(opptegnelsePollingTimeState);
    const tilbakestillFrekvensOmLitt = useDebouncedCallback(resetPollefrekvens, 8000);
    return (opptegnelser: Opptegnelse[]) => {
        setOpptegnelser(opptegnelser);
        setOpptegnelserSekvensId(opptegnelser);
        tilbakestillFrekvensOmLitt();
    };
};

const useSetOpptegnelser = () => {
    const setOpptegnelser = useSetRecoilState(nyesteOpptegnelserState);
    return (data: Opptegnelse[]) => {
        setOpptegnelser(data);
    };
};

export const useNyesteOpptegnelseSekvens = () => useRecoilValue(nyesteOpptegnelseSekvensIdState);

const useSetNyesteOpptegnelseSekvens = () => {
    const [sekvensId, setSekvensId] = useRecoilState(nyesteOpptegnelseSekvensIdState);
    return (opptegnelser: Opptegnelse[]) => {
        opptegnelser.forEach((opptegnelse) => {
            if (sekvensId === undefined || opptegnelse.sekvensnummer > sekvensId) {
                setSekvensId(opptegnelse.sekvensnummer);
            }
        });
    };
};

export const useOpptegnelserPollingRate = () => useRecoilValue(opptegnelsePollingTimeState);

export const useSetOpptegnelserPollingRate = () => {
    const setOpptegnelsePollingRate = useSetRecoilState(opptegnelsePollingTimeState);
    return (rate: number) => {
        setOpptegnelsePollingRate(rate);
    };
};

export const erOpptegnelseForNyOppgave = (opptegnelse: Opptegnelse): boolean =>
    opptegnelse.type === 'NY_SAKSBEHANDLEROPPGAVE' || opptegnelse.type === 'REVURDERING_FERDIGBEHANDLET';
