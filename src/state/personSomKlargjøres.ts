import { atom, useAtom } from 'jotai';
import { useParams } from 'next/navigation';

import { Opptegnelsetype } from '@io/graphql';
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
        if (opptegnelse.type === Opptegnelsetype.PersonKlarTilBehandling)
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
