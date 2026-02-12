import { atom, useAtom } from 'jotai';

import { KladdNotatType } from '@io/rest/generated/spesialist.schemas';

export function useNotatkladd() {
    const [notater, setNotater] = useAtom(lokaleNotaterState);
    return {
        finnNotatForVedtaksperiode: (vedtaksperiodeId: string | undefined, notattype: KladdNotatType) => {
            return notater.find((notat) => notat.type === notattype && notat.vedtaksperiodeId === vedtaksperiodeId)
                ?.tekst;
        },
        fjernNotat: (vedtaksperiodeId: string, notattype: KladdNotatType) => {
            setNotater((currentValue) => [
                ...currentValue.filter(
                    (notat) => notat.type !== notattype || notat.vedtaksperiodeId !== vedtaksperiodeId,
                ),
            ]);
        },
        upsertNotat: (tekst: string, vedtaksperiodeId: string, type: KladdNotatType) => {
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
    type: KladdNotatType;
}

const lokaleNotaterState = atom<LagretNotat[]>([]);
