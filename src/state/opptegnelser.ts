import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';
import { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Opptegnelse } from '@io/graphql';

const opptegnelsePollingTimeState = atomWithReset(5_000);

const nyesteOpptegnelserState = atomWithReset<Opptegnelse[]>([]);

const nyesteOpptegnelseSekvensIdState = atom<number | undefined>(undefined);

export const useHåndterOpptegnelser = (onOpptegnelseCallback: (o: Opptegnelse) => void) => {
    const opptegnelser = useAtomValue(nyesteOpptegnelserState);
    const resetOpptegnelser = useResetAtom(nyesteOpptegnelserState);
    useEffect(() => {
        if (opptegnelser.length > 0) {
            opptegnelser.forEach((o) => onOpptegnelseCallback(o));
            resetOpptegnelser();
        }
    }, [onOpptegnelseCallback, opptegnelser, resetOpptegnelser]);
};

export const useMottaOpptegnelser = () => {
    const setOpptegnelser = useSetAtom(nyesteOpptegnelserState);
    const setOpptegnelserSekvensId = useSetNyesteOpptegnelseSekvens();
    const resetPolleFrekvens = useResetAtom(opptegnelsePollingTimeState);
    const tilbakestillFrekvensOmLitt = useDebouncedCallback(resetPolleFrekvens, 8000);
    return (opptegnelser: Opptegnelse[]) => {
        setOpptegnelser(opptegnelser);
        setOpptegnelserSekvensId(opptegnelser);
        tilbakestillFrekvensOmLitt();
    };
};

export const useNyesteOpptegnelseSekvens = () => useAtomValue(nyesteOpptegnelseSekvensIdState);

const useSetNyesteOpptegnelseSekvens = () => {
    const [sekvensId, setSekvensId] = useAtom(nyesteOpptegnelseSekvensIdState);
    return (opptegnelser: Opptegnelse[]) => {
        opptegnelser.forEach((opptegnelse) => {
            if (sekvensId === undefined || opptegnelse.sekvensnummer > sekvensId) {
                setSekvensId(opptegnelse.sekvensnummer);
            }
        });
    };
};

export const useOpptegnelserPollingRate = () => useAtomValue(opptegnelsePollingTimeState);

export const useSetOpptegnelserPollingRate = () => {
    const setOpptegnelsePollingRate = useSetAtom(opptegnelsePollingTimeState);
    return (rate: number) => {
        setOpptegnelsePollingRate(rate);
    };
};

export const erOpptegnelseForNyOppgave = (opptegnelse: Opptegnelse): boolean =>
    opptegnelse.type === 'NY_SAKSBEHANDLEROPPGAVE' || opptegnelse.type === 'REVURDERING_FERDIGBEHANDLET';
