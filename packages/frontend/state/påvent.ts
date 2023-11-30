import { FetchResult, MutationResult, useMutation } from '@apollo/client';
import {
    AntallOppgaverDocument,
    FetchNotaterDocument,
    FjernPaVentDocument,
    FjernPaVentMutation,
    LeggPaVentDocument,
    LeggPaVentMutation,
    NotatType,
    OppgaveFeedDocument,
    PaventFragment,
} from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';

const useOptimistiskPaVent = (): PaventFragment => {
    const saksbehandler = useInnloggetSaksbehandler();
    return {
        __typename: 'PaVent',
        oid: saksbehandler.oid,
        frist: null,
        begrunnelse: null,
    };
};

export const useLeggPåVent = (): [
    (
        oppgavereferanse: string,
        frist: string,
        tildeling: boolean,
        begrunnelse: Maybe<string>,
        notattekst: string,
        vedtaksperiodeId: string,
    ) => Promise<FetchResult<LeggPaVentMutation>>,
    MutationResult<LeggPaVentMutation>,
] => {
    const optimistiskPaVent = useOptimistiskPaVent();
    const [leggPåVentMutation, data] = useMutation(LeggPaVentDocument);

    const leggPåVent = async (
        oppgavereferanse: string,
        frist: string,
        tildeling: boolean,
        begrunnelse: Maybe<string>,
        notattekst: string,
        vedtaksperiodeId: string,
    ) =>
        leggPåVentMutation({
            refetchQueries: [
                AntallOppgaverDocument,
                { query: FetchNotaterDocument, variables: { forPerioder: [vedtaksperiodeId] } },
            ],
            optimisticResponse: {
                __typename: 'Mutation',
                leggPaVent: { ...optimistiskPaVent, frist, begrunnelse },
            },
            variables: {
                oppgaveId: oppgavereferanse,
                frist: frist,
                tildeling: tildeling,
                begrunnelse: begrunnelse,
                notatType: NotatType.PaaVent,
                notatTekst: notattekst,
            },
        });

    return [leggPåVent, data];
};
export const useFjernPåVent = (): [
    (oppgavereferanse: string) => Promise<FetchResult<FjernPaVentMutation>>,
    MutationResult<FjernPaVentMutation>,
] => {
    const [fjernPåVentMutation, data] = useMutation(FjernPaVentDocument, {
        refetchQueries: [OppgaveFeedDocument, AntallOppgaverDocument],
    });
    const fjernPåVent = (oppgavereferanse: string) =>
        fjernPåVentMutation({
            variables: { oppgaveId: oppgavereferanse },
            optimisticResponse: {
                __typename: 'Mutation',
                fjernPaVent: true,
            },
        });

    return [fjernPåVent, data];
};
