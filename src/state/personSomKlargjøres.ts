import { atom, useAtom } from 'jotai';

import { useMutation } from '@apollo/client';
import { Maybe, OpprettAbonnementDocument, Opptegnelsetype } from '@io/graphql';
import { usePollEtterOpptegnelser } from '@io/graphql/polling';
import { useHåndterOpptegnelser } from '@state/opptegnelser';

export type PersonSomKlargjøres = {
    aktørId: string;
    erKlargjort: boolean;
};

const personSomKlargjøresState = atom<Maybe<PersonSomKlargjøres>>(null);

export const usePersonKlargjøres = () => {
    const [state, setState] = useAtom(personSomKlargjøresState);
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
