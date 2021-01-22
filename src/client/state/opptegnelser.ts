import { atom, selector } from 'recoil';
import { OpptegnelseDTO } from 'external-types';

export const opptegnelsePollingState = atom<boolean>({
    key: 'opptegnelsePollingState',
    default: true,
});

export const opptegnelsePollingTimeState = atom<number>({
    key: 'opptegnelsePollingTimeState',
    default: 10_000,
});

export const nyeOpptegnelserState = atom<OpptegnelseDTO[]>({
    key: 'nyeOpptegnelserState',
    default: [],
});

export const sisteSekvensIdOpptegnelseState = selector<number | undefined>({
    key: 'sisteSekvensIdOpptegnelseState',
    get: ({ get }) => {
        const nyeOpptegnelser = get(nyeOpptegnelserState);

        if (nyeOpptegnelser.length > 0) {
            return nyeOpptegnelser.reduce((acc, curr) => (curr.sekvensnummer > acc.sekvensnummer ? curr : acc))
                .sekvensnummer;
        }

        return undefined;
    },
});
