import dayjs from 'dayjs';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { useQuery } from '@apollo/client';
import { FetchNotaterDocument, NotatFragment, NotatType } from '@io/graphql';
import { ApolloResponse } from '@state/oppgaver';
import { Notat } from '@typer/notat';

export const useNotater = () => useRecoilValue(lokaleNotaterState);

export const useReplaceNotat = () => {
    const setNotat = useSetRecoilState(lokaleNotaterState);
    return (nyttNotat: LagretNotat) => {
        setNotat((currentState: LagretNotat[]) => [
            ...currentState.filter(
                (notat) => notat.type !== nyttNotat.type || notat.vedtaksperiodeId !== nyttNotat.vedtaksperiodeId,
            ),
            nyttNotat,
        ]);
    };
};

export const useFjernNotat = () => {
    const setNotat = useSetRecoilState(lokaleNotaterState);
    return (vedtaksperiodeId: string, notattype: NotatType) => {
        setNotat((currentValue) => [
            ...currentValue.filter((notat) => notat.type !== notattype || notat.vedtaksperiodeId !== vedtaksperiodeId),
        ]);
    };
};

export const useGetNotatTekst = (notattype: NotatType, vedtaksperiodeId: string): string | undefined => {
    const notater = useNotater();
    return notater.find((notat) => notat.type === notattype && notat.vedtaksperiodeId === vedtaksperiodeId)?.tekst;
};

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
    dialogRef: spesialistNotat.dialogRef,
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

const lokaleNotaterState = atom({
    key: 'lokaleNotaterState',
    default: [] as LagretNotat[],
});
