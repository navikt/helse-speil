import { ApolloCache, FetchResult, InternalRefetchQueriesInclude, MutationResult, useMutation } from '@apollo/client';
import {
    AntallOppgaverDocument,
    Egenskap,
    EndrePaVentDocument,
    EndrePaVentMutation,
    FetchPersonDocument,
    FjernPaVentDocument,
    FjernPaVentMutation,
    Kategori,
    LeggPaVentDocument,
    LeggPaVentMutation,
    Oppgaveegenskap,
    PaVent,
    PaVentArsakInput,
    PaventFragment,
} from '@io/graphql';
import { getGetOppgaverQueryKey } from '@io/rest/generated/oppgaver/oppgaver';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useQueryClient } from '@tanstack/react-query';

const useOptimistiskPaVent = (): PaventFragment => {
    const saksbehandler = useInnloggetSaksbehandler();
    return {
        __typename: 'PaVent',
        oid: saksbehandler.oid,
        frist: null,
    };
};

export const useLeggPåVent = (
    behandlingId?: string,
): [
    (
        oppgavereferanse: string,
        frist: string,
        tildeling: boolean,
        notattekst: string | null,
        arsaker: PaVentArsakInput[],
    ) => Promise<FetchResult<LeggPaVentMutation>>,
    MutationResult<LeggPaVentMutation>,
] => {
    const optimistiskPaVent = useOptimistiskPaVent();
    const queryClient = useQueryClient();
    const [leggPåVentMutation, data] = useMutation(LeggPaVentDocument);

    const leggPåVent = async (
        oppgavereferanse: string,
        frist: string,
        tildeling: boolean,
        notattekst: string | null,
        arsaker: PaVentArsakInput[],
    ) =>
        leggPåVentMutation({
            refetchQueries: [AntallOppgaverDocument],
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
                oppdaterPåVentICache(cache, oppgavereferanse, behandlingId ?? null, result.data?.leggPaVent ?? null),
        }).then(async (value) => {
            await queryClient.invalidateQueries({ queryKey: getGetOppgaverQueryKey() });
            return value;
        });

    return [leggPåVent, data];
};

export const useEndrePåVent = (
    behandlingId?: string,
): [
    (
        oppgavereferanse: string,
        frist: string,
        tildeling: boolean,
        notattekst: string | null,
        arsaker: PaVentArsakInput[],
    ) => Promise<FetchResult<EndrePaVentMutation>>,
    MutationResult<EndrePaVentMutation>,
] => {
    const queryClient = useQueryClient();
    const optimistiskPaVent = useOptimistiskPaVent();
    const [endrePåVentMutation, data] = useMutation(EndrePaVentDocument);

    const endrePåVent = async (
        oppgavereferanse: string,
        frist: string,
        tildeling: boolean,
        notattekst: string | null,
        arsaker: PaVentArsakInput[],
    ) =>
        endrePåVentMutation({
            refetchQueries: [AntallOppgaverDocument],
            optimisticResponse: {
                __typename: 'Mutation',
                endrePaVent: { ...optimistiskPaVent, frist },
            },
            variables: {
                oppgaveId: oppgavereferanse,
                frist: frist,
                tildeling: tildeling,
                notatTekst: notattekst,
                arsaker: arsaker,
            },
            update: (cache, result) =>
                oppdaterPåVentICache(cache, oppgavereferanse, behandlingId ?? null, result.data?.endrePaVent ?? null),
        }).then(async (value) => {
            await queryClient.invalidateQueries({ queryKey: getGetOppgaverQueryKey() });
            return value;
        });

    return [endrePåVent, data];
};

export const useFjernPåVentFraSaksbilde = (
    behandlingId: string | undefined,
): [(oppgavereferanse: string) => Promise<FetchResult<FjernPaVentMutation>>, MutationResult<FjernPaVentMutation>] =>
    useFjernPåVent([FetchPersonDocument], behandlingId);

export const useFjernPåVentFraOppgaveoversikt = (): [
    (oppgavereferanse: string) => Promise<FetchResult<FjernPaVentMutation>>,
    MutationResult<FjernPaVentMutation>,
] => useFjernPåVent([AntallOppgaverDocument]);

const useFjernPåVent = (
    refetchQueries: InternalRefetchQueriesInclude,
    behandlingId?: string,
): [(oppgavereferanse: string) => Promise<FetchResult<FjernPaVentMutation>>, MutationResult<FjernPaVentMutation>] => {
    const queryClient = useQueryClient();
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
        }).then(async (value) => {
            await queryClient.invalidateQueries({ queryKey: getGetOppgaverQueryKey() });
            return value;
        });

    return [fjernPåVent, data];
};

const oppdaterPåVentICache = (
    cache: ApolloCache<unknown>,
    oppgavereferanse: string,
    behandlingId: string | null,
    påVent: PaVent | null,
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
