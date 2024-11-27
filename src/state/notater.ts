import dayjs from 'dayjs';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { NotatFragment, NotatType } from '@io/graphql';
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
