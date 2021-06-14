import { Opptegnelse, OpptegnelseType } from 'external-types';
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

export const opptegnelsePollingTimeState = atom<number>({
    key: 'opptegnelsePollingTimeState',
    default: 10_000,
});

export const nyesteOpptegnelserState = atom<Opptegnelse[]>({
    key: 'nyesteOpptegnelserState',
    default: [],
});

export const nyesteOpptegnelseMedTypeOppgaveState = selector<Opptegnelse | undefined>({
    key: 'nyesteOpptegnelseMedTypeOppgaveState',
    get: ({ get }) =>
        get(nyesteOpptegnelserState).find(
            (opptegnelse) => opptegnelse.type === OpptegnelseType.NY_SAKSBEHANDLEROPPGAVE
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

export const useOpptegnelser = () => useRecoilValue(nyesteOpptegnelseMedTypeOppgaveState);

export const useSetOpptegnelserPollingRate = () => {
    const setOpptegnelsePollingRate = useSetRecoilState(opptegnelsePollingTimeState);
    return (rate: number) => {
        setOpptegnelsePollingRate(rate);
    };
};

export const useOpptegnelserPollingRate = () => useRecoilValue(opptegnelsePollingTimeState);
