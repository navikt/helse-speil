import { selectorFamily, useRecoilValue } from 'recoil';
import { fetchOppdrag, Oppdrag } from '@io/graphql';

const oppdragState = selectorFamily<Array<Oppdrag>, string>({
    key: 'oppdragState',
    get: (fødselsnummer: string) => () => {
        return fetchOppdrag(fødselsnummer).then((res) => res.oppdrag);
    },
});

export const useOppdrag = (fødselsnummer: string) => {
    return useRecoilValue(oppdragState(fødselsnummer));
};
