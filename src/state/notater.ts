import { atom, useAtom } from 'jotai';

import { NotatType } from '@io/graphql';

export function useNotatkladd() {
    const [notater, setNotater] = useAtom(lokaleNotaterState);
    return {
        finnNotatForVedtaksperiode: (vedtaksperiodeId: string | undefined, notattype: NotatType) => {
            return notater.find((notat) => notat.type === notattype && notat.vedtaksperiodeId === vedtaksperiodeId)
                ?.tekst;
        },
        fjernNotat: (vedtaksperiodeId: string, notattype: NotatType) => {
            setNotater((currentValue) => [
                ...currentValue.filter(
                    (notat) => notat.type !== notattype || notat.vedtaksperiodeId !== vedtaksperiodeId,
                ),
            ]);
        },
        upsertNotat: (tekst: string, vedtaksperiodeId: string, type: NotatType) => {
            setNotater((currentState: LagretNotat[]) => [
                ...currentState.filter((notat) => notat.type !== type || notat.vedtaksperiodeId !== vedtaksperiodeId),
                {
                    tekst,
                    vedtaksperiodeId,
                    type,
                },
            ]);
        },
    };
}

interface LagretNotat {
    vedtaksperiodeId: string;
    tekst: string;
    type: NotatType;
}

const lokaleNotaterState = atom<LagretNotat[]>([]);
