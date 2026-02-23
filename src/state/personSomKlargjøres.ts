import { atom, useAtom } from 'jotai';

import { ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { useHåndterNyttEvent } from '@state/serverSentEvents';

export type PersonSomKlargjøres = {
    personPseudoId: string;
    erKlargjort: boolean;
};

const personSomKlargjøresState = atom<PersonSomKlargjøres | null>(null);

export const usePersonKlargjøres = () => {
    const [state, setState] = useAtom(personSomKlargjøresState);

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
