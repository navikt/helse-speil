import { atom, useRecoilState } from 'recoil';

import { useMutation } from '@apollo/client';
import { OpprettAbonnementDocument, Opptegnelsetype } from '@io/graphql';
import { usePollEtterOpptegnelser } from '@io/graphql/polling';
import { useHåndterOpptegnelser } from '@state/opptegnelser';

export type PersonSomKlargjøres = {
    aktørId: string;
    erKlargjort: boolean;
};

const personSomKlargjøresState = atom<PersonSomKlargjøres | null>({
    key: 'personSomKlargjøresState',
    default: null,
});

export const usePersonKlargjøres = () => {
    const [state, setState] = useRecoilState(personSomKlargjøresState);
    const [opprettAbonnement] = useMutation(OpprettAbonnementDocument);
    usePollEtterOpptegnelser();

    useHåndterOpptegnelser(async (opptegnelse) => {
        if (state?.aktørId === opptegnelse.aktorId && opptegnelse.type === Opptegnelsetype.PersonKlarTilBehandling)
            setState((prev) => prev && { ...prev, erKlargjort: true });
    });

    return {
        venterPåKlargjøring: (aktørId: string) => {
            void opprettAbonnement({ variables: { personidentifikator: aktørId } });
            setState({ aktørId, erKlargjort: false });
        },
        nullstill: () => setState(null),
        venter: state !== null && !state.erKlargjort,
        klargjortAktørId: state?.aktørId,
    };
};
