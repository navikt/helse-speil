import { atom, useAtom } from 'jotai';

import { ApiOpptegnelseType, ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { useHåndterOpptegnelser } from '@state/opptegnelser';
import { useHåndterNyttEvent } from '@state/serverSentEvents';

export type PersonSomKlargjøres = {
    personPseudoId: string;
    erKlargjort: boolean;
};

const personSomKlargjøresState = atom<PersonSomKlargjøres | null>(null);

export const usePersonKlargjøres = () => {
    const [state, setState] = useAtom(personSomKlargjøresState);

    useHåndterOpptegnelser(async (opptegnelse) => {
        if (opptegnelse.type === ApiOpptegnelseType.PERSON_KLAR_TIL_BEHANDLING)
            setState((prev) => prev && { ...prev, erKlargjort: true });
    });

    useHåndterNyttEvent(async (event) => {
        if (event.event === ApiServerSentEventEvent.PERSON_KLAR_TIL_BEHANDLING)
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
