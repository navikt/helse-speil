import { atom, useAtom } from 'jotai';

import { ApiOpptegnelseType } from '@io/rest/generated/spesialist.schemas';
import { usePollEtterOpptegnelser } from '@io/rest/polling';
import { useHåndterOpptegnelser } from '@state/opptegnelser';

export type PersonSomKlargjøres = {
    personPseudoId: string;
    erKlargjort: boolean;
};

const personSomKlargjøresState = atom<PersonSomKlargjøres | null>(null);

export const usePersonKlargjøres = () => {
    const [state, setState] = useAtom(personSomKlargjøresState);
    usePollEtterOpptegnelser(state?.personPseudoId);

    useHåndterOpptegnelser(async (opptegnelse) => {
        if (opptegnelse.type === ApiOpptegnelseType.PERSON_KLAR_TIL_BEHANDLING)
            setState((prev) => prev && { ...prev, erKlargjort: true });
    });

    return {
        venterPåKlargjøring: (personPseudoId: string) => {
            setState({ personPseudoId, erKlargjort: false });
        },
        nullstill: () => setState(null),
        venter: state !== null && !state.erKlargjort,
        klargjortPseudoId: state?.personPseudoId,
    };
};
