import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';
import { useEffect } from 'react';

import { ApiOpptegnelse } from '@io/rest/generated/spesialist.schemas';

const nyesteOpptegnelserState = atomWithReset<ApiOpptegnelse[]>([]);

export const useHåndterOpptegnelser = (onOpptegnelseCallback: (o: ApiOpptegnelse) => void) => {
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
    return (opptegnelser: ApiOpptegnelse[]) => {
        setOpptegnelser((prev) => [...prev, ...opptegnelser]);
    };
};
export const erOpptegnelseForNyOppgave = (opptegnelse: ApiOpptegnelse): boolean =>
    opptegnelse.type === 'NY_SAKSBEHANDLEROPPGAVE' || opptegnelse.type === 'REVURDERING_FERDIGBEHANDLET';
