import dayjs from 'dayjs';
import { useEffect } from 'react';
import { atom, useRecoilState, useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import { Notat as GraphQLNotat } from '@io/graphql';
import { getNotater } from '@io/http';

export const useSyncNotater = (vedtaksperiodeIder: string[]) => {
    const setNotaterState = useSetRecoilState(notaterState);

    useEffect(() => {
        fetchNotater(vedtaksperiodeIder).then(setNotaterState);
    }, [JSON.stringify(vedtaksperiodeIder)]);
};

function fetchNotater(ider: string[]) {
    if (ider.length < 1) {
        return Promise.resolve([]);
    }
    return getNotater(ider).then((response) =>
        Object.values(response)
            .flat()
            .map(toNotat)
            .sort((a, b) => (a.opprettet < b.opprettet ? 1 : -1)),
    );
}

const notaterState = atom<Array<Notat>>({
    key: 'notaterState',
    default: [],
});

export const useRefreshNotater = () => {
    const [state, setState] = useRecoilState(notaterState);
    return () => {
        const vedtaksperiodeIder = state.map((notat) => notat.vedtaksperiodeId);
        if (vedtaksperiodeIder.length > 0) fetchNotater(vedtaksperiodeIder).then(setState);
    };
};

export const useNotaterForVedtaksperiode = (vedtaksperiodeId?: string) => {
    const notater = useRecoilValueLoadable<Notat[]>(notaterState);
    return notater.state === 'hasValue'
        ? notater.contents.filter((notat) => notat.vedtaksperiodeId == vedtaksperiodeId)
        : [];
};

export const toNotat = (spesialistNotat: ExternalNotat | GraphQLNotat): Notat => ({
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
    kommentarer: (spesialistNotat as GraphQLNotat).kommentarer ?? [],
});
