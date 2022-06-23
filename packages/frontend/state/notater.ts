import dayjs from 'dayjs';
import { atom, selector, useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import { getNotater } from '@io/http';
import { Notat as GraphQLNotat } from '@io/graphql';
import { useEffect } from 'react';

const notaterStateRefetchKey = atom<Date>({
    key: 'notaterStateRefetchKey',
    default: new Date(),
});

export const useRefreshNotater = () => {
    const setKey = useSetRecoilState(notaterStateRefetchKey);
    return () => {
        setKey(new Date());
    };
};

const vedtaksperiodeIderState = atom<string[]>({
    key: 'vedtaksperiodeIderState',
    default: [],
});

export const useSyncNotater = (vedtaksperiodeIder: string[]) => {
    const setNotatVedtaksperioder = useSetRecoilState(vedtaksperiodeIderState);

    useEffect(() => {
        setNotatVedtaksperioder(vedtaksperiodeIder);
    }, [JSON.stringify(vedtaksperiodeIder)]);
};

const notaterState = selector<Notat[]>({
    key: 'notaterState',
    get: ({ get }) => {
        get(notaterStateRefetchKey);
        const vedtaksperiodeIder = get(vedtaksperiodeIderState);

        if (vedtaksperiodeIder.length < 1) {
            return Promise.resolve([]);
        }

        return getNotater(vedtaksperiodeIder).then((res) => {
            return Object.values(res)
                .flat()
                .map(toNotat)
                .sort((a, b) => (a.opprettet < b.opprettet ? 1 : -1));
        });
    },
});

export const useNotaterForVedtaksperiode = (vedtaksperiodeId?: string) => {
    const notater = useRecoilValueLoadable<Notat[]>(notaterState);
    return notater.state === 'hasValue'
        ? notater.contents.filter((notat) => notat.vedtaksperiodeId == vedtaksperiodeId)
        : [];
};

export const toNotat = (spesialistNotat: ExternalNotat | GraphQLNotat): Notat => ({
    id: spesialistNotat.id.toString(),
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
});
