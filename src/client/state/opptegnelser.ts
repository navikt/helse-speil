import { Opptegnelse, OpptegnelseType } from 'external-types';
import { atom, selector } from 'recoil';

export const opptegnelsePollingState = atom<boolean>({
    key: 'opptegnelsePollingState',
    default: true,
});

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
    get: ({ get }) => {
        return get(nyesteOpptegnelserState).find(
            (opptegnelse) => opptegnelse.type === OpptegnelseType.NY_SAKSBEHANDLEROPPGAVE
        );
    },
});

export const sisteSekvensIdOpptegnelseState = selector<number | undefined>({
    key: 'sisteSekvensIdOpptegnelseState',
    get: ({ get }) => {
        const nyesteOpptegnelser = get(nyesteOpptegnelserState);

        if (nyesteOpptegnelser.length > 0) {
            return nyesteOpptegnelser.reduce((acc, curr) => (curr.sekvensnummer > acc.sekvensnummer ? curr : acc))
                .sekvensnummer;
        }

        return undefined;
    },
});
