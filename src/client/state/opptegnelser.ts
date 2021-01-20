import { atom, selector } from 'recoil';
import { OpptegnelseDTO } from 'external-types';

export const opptegnelsePollingState = atom<boolean>({
    key: 'opptegnelsePollingState',
    default: true,
});

export const opptegnelsePollingTimeState = atom<number>({
    key: 'opptegnelsePollingTimeState',
    default: 1000,
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
            const sekvensnummer = nyeOpptegnelser.reduce((acc, curr) => {
                return curr.sekvensnummer > acc.sekvensnummer ? curr : acc;
            }).sekvensnummer;

            return sekvensnummer;
        }

        return undefined;
    },
});
