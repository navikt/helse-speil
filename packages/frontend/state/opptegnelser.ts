import { atom, selector, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

export const opptegnelsePollingTimeState = atom<number>({
    key: 'opptegnelsePollingTimeState',
    default: 5_000,
});

export const nyesteOpptegnelserState = atom<Opptegnelse[]>({
    key: 'nyesteOpptegnelserState',
    default: [],
});

const nyesteOpptegnelserStateNy = atom<Opptegnelse[]>({
    key: 'nyesteOpptegnelserStateNy',
    default: [],
});

export const nyesteOpptegnelseMedTypeOppgaveState = selector<Opptegnelse | undefined>({
    key: 'nyesteOpptegnelseMedTypeOppgaveState',
    get: ({ get }) =>
        get(nyesteOpptegnelserState).find(
            (opptegnelse) =>
                opptegnelse.type === 'NY_SAKSBEHANDLEROPPGAVE' || opptegnelse.type === 'REVURDERING_FERDIGBEHANDLET',
        ),
});

export const sisteSekvensIdOpptegnelseState = selector<number | undefined>({
    key: 'sisteSekvensIdOpptegnelseState',
    get: ({ get }) => {
        const nyesteOpptegnelser = get(nyesteOpptegnelserState);

        return nyesteOpptegnelser.length > 0
            ? nyesteOpptegnelser.reduce((acc, curr) => (curr.sekvensnummer > acc.sekvensnummer ? curr : acc))
                  .sekvensnummer
            : undefined;
    },
});

export const useHåndterOpptegnelser = (onOpptegnelseCallback: (o: Opptegnelse) => void) => {
    const opptegnelser = useRecoilValue(nyesteOpptegnelserStateNy);
    const resetOpptegnelser = useResetRecoilState(nyesteOpptegnelserStateNy);
    opptegnelser?.forEach((o) => onOpptegnelseCallback(o));
    resetOpptegnelser();
};

export const useSetOpptegnelserNy = () => {
    const setOpptegnelser = useSetRecoilState(nyesteOpptegnelserStateNy);
    return (data: Opptegnelse[]) => {
        setOpptegnelser(data);
    };
};

export const useOpptegnelser = () => useRecoilValue(nyesteOpptegnelseMedTypeOppgaveState);

export const useSetOpptegnelserPollingRate = () => {
    const setOpptegnelsePollingRate = useSetRecoilState(opptegnelsePollingTimeState);
    return (rate: number) => {
        setOpptegnelsePollingRate(rate);
    };
};

export const useOpptegnelserPollingRate = () => useRecoilValue(opptegnelsePollingTimeState);
