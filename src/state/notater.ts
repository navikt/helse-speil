import dayjs from 'dayjs';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import { useMutation } from '@apollo/client';
import { LeggTilKommentarDocument, NotatFragment, NotatType, PeriodehistorikkType } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { Notat } from '@typer/notat';

export const useNotater = () => useAtomValue(lokaleNotaterState);

export const useReplaceNotat = () => {
    const setNotat = useSetAtom(lokaleNotaterState);
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
    const setNotat = useSetAtom(lokaleNotaterState);
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

export const useLeggTilKommentar = (
    dialogRef: number,
    kommentertInnhold: KommentertElement,
    hideDialog: () => void,
) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const [leggTilKommentar, { error, loading }] = useMutation(LeggTilKommentarDocument);

    const onLeggTilKommentar = async (tekst: string) => {
        const saksbehandlerident = innloggetSaksbehandler.ident;
        if (saksbehandlerident) {
            await leggTilKommentar({
                variables: {
                    tekst,
                    dialogRef,
                    saksbehandlerident,
                },
                update: (cache, { data }) => {
                    cache.writeQuery({
                        query: LeggTilKommentarDocument,
                        variables: {
                            tekst,
                            dialogRef,
                            saksbehandlerident,
                        },
                        data,
                    });
                    cache.modify({
                        id: cache.identify({ __typename: kommentertInnhold.type, id: kommentertInnhold.id }),
                        fields: {
                            kommentarer(eksisterendeKommentarer) {
                                return [
                                    ...eksisterendeKommentarer,
                                    {
                                        __ref: cache.identify({
                                            __typename: 'Kommentar',
                                            id: data?.leggTilKommentar?.id,
                                        }),
                                    },
                                ];
                            },
                        },
                    });
                },
            });
            hideDialog();
        }
    };

    return {
        onLeggTilKommentar,
        loading,
        error,
    };
};

type KommentertElementType = 'LagtPaVent' | 'EndrePaVent' | 'TotrinnsvurderingRetur' | 'Notat';

interface KommentertElement {
    id: number;
    type: KommentertElementType;
}

export const finnKommentertElementType = (historikktype?: PeriodehistorikkType): KommentertElementType => {
    switch (historikktype) {
        case PeriodehistorikkType.LeggPaVent:
            return 'LagtPaVent';
        case PeriodehistorikkType.EndrePaVent:
            return 'EndrePaVent';
        case PeriodehistorikkType.TotrinnsvurderingRetur:
            return 'TotrinnsvurderingRetur';
        default:
            return 'Notat';
    }
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
    erOpphevStans: spesialistNotat.type === 'OpphevStans',
    kommentarer: spesialistNotat.kommentarer ?? [],
});

export interface LagretNotat {
    vedtaksperiodeId: string;
    tekst: string;
    type: NotatType;
}

const lokaleNotaterState = atom<LagretNotat[]>([]);
