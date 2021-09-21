import dayjs from 'dayjs';
import { atom, selector, useRecoilValueLoadable } from 'recoil';

import { getNotater } from '../io/http';

export const notaterStateRefetchKey = atom<Date>({
    key: 'notaterStateRefetchKey',
    default: new Date(),
});

export const notaterState = selector<Notat[]>({
    key: 'spesialistNotaterState',
    get: async ({ get }) => {
        get(notaterStateRefetchKey);
        const vedtaksperiodeIder = get(vedtaksperioderTilVisningState);
        if (vedtaksperiodeIder.length < 1) return [];

        const notater = await getNotater(get(vedtaksperioderTilVisningState)).then((res) => {
            return Object.values(res)
                .flat()
                .map(toNotat)
                .sort((a, b) => (a.opprettet < b.opprettet ? 1 : -1));
        });
        return notater;
    },
});

export const vedtaksperioderTilVisningState = atom<string[]>({
    key: 'vedtaksperioderTilVisningState',
    default: [],
});

export const useNotaterForVedtaksperiode = (vedtaksperiodeId: string) => {
    const notater = useRecoilValueLoadable<Notat[]>(notaterState);
    return notater.state === 'hasValue'
        ? notater.contents.filter((notat) => notat.vedtaksperiodeId == vedtaksperiodeId)
        : [];
};

const toNotat = (spesialistNotat: ExternalNotat): Notat => ({
    id: spesialistNotat.id,
    tekst: spesialistNotat.tekst,
    saksbehandler: {
        navn: spesialistNotat.saksbehandlerNavn,
        oid: spesialistNotat.saksbehandlerOid,
        epost: spesialistNotat.saksbehandlerEpost,
    },
    opprettet: dayjs(spesialistNotat.opprettet),
    vedtaksperiodeId: spesialistNotat.vedtaksperiodeId,
    feilregistrert: spesialistNotat.feilregistrert,
});
