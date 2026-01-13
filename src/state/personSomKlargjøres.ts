import { atom, useAtom } from 'jotai';
import { useParams } from 'next/navigation';

import { ApiOpptegnelseType } from '@io/rest/generated/spesialist.schemas';
import { usePollEtterOpptegnelser } from '@io/rest/polling';
import { useHåndterOpptegnelser } from '@state/opptegnelser';

export type PersonSomKlargjøres = {
    aktørId: string;
    erKlargjort: boolean;
};

const personSomKlargjøresState = atom<PersonSomKlargjøres | null>(null);

export const usePersonKlargjøres = () => {
    const [state, setState] = useAtom(personSomKlargjøresState);
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    usePollEtterOpptegnelser(personPseudoId);

    useHåndterOpptegnelser(async (opptegnelse) => {
        if (opptegnelse.type === ApiOpptegnelseType.PERSON_KLAR_TIL_BEHANDLING)
            setState((prev) => prev && { ...prev, erKlargjort: true });
    });

    return {
        venterPåKlargjøring: (aktørId: string) => {
            setState({ aktørId, erKlargjort: false });
        },
        nullstill: () => setState(null),
        venter: state !== null && !state.erKlargjort,
        klargjortAktørId: state?.aktørId,
    };
};
