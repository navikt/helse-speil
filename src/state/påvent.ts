import { ApolloCache, FetchResult, InternalRefetchQueriesInclude, MutationResult, useMutation } from '@apollo/client';
import {
    AntallOppgaverDocument,
    Egenskap,
    FetchPersonDocument,
    FjernPaVentDocument,
    FjernPaVentMutation,
    Kategori,
    LeggPaVentDocument,
    LeggPaVentMutation,
    Maybe,
    OppgaveFeedDocument,
    Oppgaveegenskap,
    PaVent,
    PaVentArsakInput,
    PaventFragment,
} from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';

const useOptimistiskPaVent = (): PaventFragment => {
    const saksbehandler = useInnloggetSaksbehandler();
    return {
        __typename: 'PaVent',
        oid: saksbehandler.oid,
        frist: null,
    };
};

export const useLeggPåVent = (
    periodeId?: string,
): [
    (
        oppgavereferanse: string,
        frist: string,
        tildeling: boolean,
        notattekst: Maybe<string>,
        arsaker: PaVentArsakInput[],
    ) => Promise<FetchResult<LeggPaVentMutation>>,
    MutationResult<LeggPaVentMutation>,
] => {
    const optimistiskPaVent = useOptimistiskPaVent();
    const [leggPåVentMutation, data] = useMutation(LeggPaVentDocument);

    const leggPåVent = async (
        oppgavereferanse: string,
        frist: string,
        tildeling: boolean,
        notattekst: Maybe<string>,
        arsaker: PaVentArsakInput[],
    ) =>
        leggPåVentMutation({
            refetchQueries: [OppgaveFeedDocument, AntallOppgaverDocument],
            optimisticResponse: {
                __typename: 'Mutation',
                leggPaVent: { ...optimistiskPaVent, frist },
            },
            variables: {
                oppgaveId: oppgavereferanse,
                frist: frist,
                tildeling: tildeling,
                notatTekst: notattekst,
                arsaker: arsaker,
            },
            update: (cache, result) =>
                oppdaterPåVentICache(cache, oppgavereferanse, periodeId ?? null, result.data?.leggPaVent ?? null),
        });

    return [leggPåVent, data];
};

export const useFjernPåVentFraSaksbilde = (
    behandlingId: string | undefined,
): [(oppgavereferanse: string) => Promise<FetchResult<FjernPaVentMutation>>, MutationResult<FjernPaVentMutation>] =>
    useFjernPåVent([FetchPersonDocument], behandlingId);

export const useFjernPåVentFraOppgaveoversikt = (): [
    (oppgavereferanse: string) => Promise<FetchResult<FjernPaVentMutation>>,
    MutationResult<FjernPaVentMutation>,
] => useFjernPåVent([OppgaveFeedDocument, AntallOppgaverDocument]);

const useFjernPåVent = (
    refetchQueries: InternalRefetchQueriesInclude,
    behandlingId?: string,
): [(oppgavereferanse: string) => Promise<FetchResult<FjernPaVentMutation>>, MutationResult<FjernPaVentMutation>] => {
    const [fjernPåVentMutation, data] = useMutation(FjernPaVentDocument, {
        refetchQueries: refetchQueries,
    });

    const fjernPåVent = (oppgavereferanse: string) =>
        fjernPåVentMutation({
            variables: { oppgaveId: oppgavereferanse },
            optimisticResponse: {
                __typename: 'Mutation',
                fjernPaVent: true,
            },
            update: (cache) => oppdaterPåVentICache(cache, oppgavereferanse, behandlingId ?? null, null),
        });

    return [fjernPåVent, data];
};

const oppdaterPåVentICache = (
    cache: ApolloCache<unknown>,
    oppgavereferanse: string,
    behandlingId: Maybe<string>,
    påVent: Maybe<PaVent>,
) => {
    cache.modify({
        id: cache.identify({ __typename: 'OppgaveTilBehandling', id: oppgavereferanse }),
        fields: {
            egenskaper: (existingEgenskaper) =>
                !påVent
                    ? existingEgenskaper.filter((it: Oppgaveegenskap) => it.egenskap !== Egenskap.PaVent)
                    : existingEgenskaper.some((it: Oppgaveegenskap) => it.egenskap === Egenskap.PaVent)
                      ? existingEgenskaper
                      : [...existingEgenskaper, { egenskap: Egenskap.PaVent, kategori: Kategori.Status }],
        },
    });

    cache.modify({
        id: cache.identify({ __typename: 'BeregnetPeriode', behandlingId: behandlingId }),
        fields: {
            paVent: (_) => påVent,
            egenskaper: (existingEgenskaper) =>
                !påVent
                    ? existingEgenskaper.filter((it: Oppgaveegenskap) => it.egenskap !== Egenskap.PaVent)
                    : existingEgenskaper.some((it: Oppgaveegenskap) => it.egenskap === Egenskap.PaVent)
                      ? existingEgenskaper
                      : [...existingEgenskaper, { egenskap: Egenskap.PaVent, kategori: Kategori.Status }],
        },
    });
};
