import dayjs from 'dayjs';
import { atom } from 'recoil';

import { useQuery } from '@apollo/client';
import { FetchNotaterDocument, NotatFragment, NotatType } from '@io/graphql';
import { ApolloResponse } from '@state/oppgaver';
import { Notat } from '@typer/notat';

export const useQueryNotater = (vedtaksperiodeIder: string[]): ApolloResponse<Notat[]> => {
    const fetchNotater = useQuery(FetchNotaterDocument, {
        variables: {
            forPerioder: vedtaksperiodeIder,
        },
    });

    return {
        data: fetchNotater.data?.notater
            ?.flatMap((it) => it.notater)
            .map(toNotat)
            .sort((a, b) => (a.opprettet < b.opprettet ? 1 : -1)),
        error: fetchNotater.error,
        loading: fetchNotater.loading,
    };
};
export const useNotaterForVedtaksperiode = (vedtaksperiodeId: string) => {
    const notater = useQueryNotater([vedtaksperiodeId]);
    return notater.data?.filter((notat) => notat.vedtaksperiodeId == vedtaksperiodeId) ?? [];
};

export const toNotat = (spesialistNotat: NotatFragment): Notat => ({
    id: `${spesialistNotat.id}`,
    tekst: spesialistNotat.tekst,
    saksbehandler: {
        navn: spesialistNotat.saksbehandlerNavn,
        oid: spesialistNotat.saksbehandlerOid,
        epost: spesialistNotat.saksbehandlerEpost,
        ident: spesialistNotat.saksbehandlerIdent,
    },
    opprettet: dayjs(spesialistNotat.opprettet),
    vedtaksperiodeId: spesialistNotat.vedtaksperiodeId,
    feilregistrert: spesialistNotat.feilregistrert,
    type: spesialistNotat.type,
    kommentarer: spesialistNotat.kommentarer ?? [],
});

export interface LagretNotat {
    vedtaksperiodeId: string;
    tekst: string;
    type: NotatType;
}

export const lokaleNotaterState = atom({
    key: 'lokaleNotaterState',
    default: [] as LagretNotat[],
});
