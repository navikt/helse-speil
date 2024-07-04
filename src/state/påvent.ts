import { ApolloCache, FetchResult, MutationResult, useMutation } from '@apollo/client';
import {
    AntallOppgaverDocument,
    Egenskap,
    FetchNotaterDocument,
    FjernPaVentDocument,
    FjernPaVentMutation,
    Kategori,
    LeggPaVentDocument,
    LeggPaVentMutation,
    Maybe,
    OppgaveFeedDocument,
    Oppgaveegenskap,
    PaVent,
    PaventFragment,
} from '@io/graphql';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
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
    const periodeId = usePeriodeTilGodkjenning()?.id ?? null;

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
                OppgaveFeedDocument,
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
                notatTekst: notattekst,
            },
            update: (cache, result) =>
                oppdaterPåVentICache(cache, oppgavereferanse, periodeId, () => result.data?.leggPaVent ?? null),
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
    const behandlingId = usePeriodeTilGodkjenning()?.behandlingId ?? null;

    const fjernPåVent = (oppgavereferanse: string) =>
        fjernPåVentMutation({
            variables: { oppgaveId: oppgavereferanse },
            optimisticResponse: {
                __typename: 'Mutation',
                fjernPaVent: true,
            },
            update: (cache) => oppdaterPåVentICache(cache, oppgavereferanse, behandlingId, () => null),
        });

    return [fjernPåVent, data];
};

const oppdaterPåVentICache = (
    cache: ApolloCache<unknown>,
    oppgavereferanse: string,
    behandlingId: Maybe<string>,
    påVent: (påVent: PaVent) => Maybe<PaVent>,
) => {
    cache.modify({
        id: cache.identify({ __typename: 'OppgaveTilBehandling', id: oppgavereferanse }),
        fields: {
            egenskaper(existingEgenskaper) {
                return !påVent
                    ? existingEgenskaper.filter((it: Oppgaveegenskap) => it.egenskap !== Egenskap.PaVent)
                    : existingEgenskaper.some((it: Oppgaveegenskap) => it.egenskap === Egenskap.PaVent)
                      ? existingEgenskaper
                      : [...existingEgenskaper, { egenskap: Egenskap.PaVent, kategori: Kategori.Status }];
            },
        },
    });

    cache.modify({
        id: cache.identify({ __typename: 'BeregnetPeriode', behandlingId: behandlingId }),
        fields: {
            paVent: (value) => påVent(value),
            egenskaper(existingEgenskaper) {
                return !påVent
                    ? existingEgenskaper.filter((it: Oppgaveegenskap) => it.egenskap !== Egenskap.PaVent)
                    : existingEgenskaper.some((it: Oppgaveegenskap) => it.egenskap === Egenskap.PaVent)
                      ? existingEgenskaper
                      : [...existingEgenskaper, { egenskap: Egenskap.PaVent, kategori: Kategori.Status }];
            },
        },
    });
};
