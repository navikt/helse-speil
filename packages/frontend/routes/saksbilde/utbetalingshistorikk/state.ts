import { selectorFamily, useRecoilValue } from 'recoil';

import { Oppdrag, fetchOppdrag } from '@io/graphql';

const oppdragState = selectorFamily<Array<Oppdrag>, string>({
    key: 'oppdragState',
    get: (fødselsnummer: string) => () => {
        return fetchOppdrag(fødselsnummer).then((res) => res.oppdrag);
    },
});

export const useOppdrag = (fødselsnummer: string): Array<Oppdrag> => {
    return useRecoilValue(oppdragState(fødselsnummer));
};

export const useArbeidsgiveroppdrag = (fødselsnummer: string, fagsystemId: string): Oppdrag | null => {
    const oppdrag = useOppdrag(fødselsnummer);
    return [...oppdrag].reverse().find((it) => it.arbeidsgiveroppdrag?.fagsystemId === fagsystemId) ?? null;
};
