import dayjs from 'dayjs';
import { atom, useAtom } from 'jotai';
import { SubmitHandler } from 'react-hook-form';

import { KommentarFormFields } from '@/form-schemas/kommentarSkjema';
import { useApolloClient } from '@apollo/client';
import { LeggTilKommentarDocument, NotatFragment, NotatType, PeriodehistorikkType } from '@io/graphql';
import { usePostKommentar } from '@io/rest/generated/dialoger/dialoger';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { Notat } from '@typer/notat';
import { ISO_DATOFORMAT } from '@utils/date';

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

export const useLeggTilKommentar = (
    dialogRef: number,
    kommentertInnhold: KommentertElement,
    hideDialog: () => void,
) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const { mutate, error, isPending: loading } = usePostKommentar();
    const apolloClient = useApolloClient();

    const onLeggTilKommentar: SubmitHandler<KommentarFormFields> = async (formFields) => {
        const saksbehandlerident = innloggetSaksbehandler.ident;
        const tekst = formFields.tekst;
        if (saksbehandlerident) {
            mutate(
                {
                    dialogId: dialogRef,
                    data: {
                        tekst,
                    },
                },
                {
                    onSuccess: async (data) => {
                        apolloClient.cache.writeQuery({
                            query: LeggTilKommentarDocument,
                            variables: {
                                tekst,
                                dialogRef,
                                saksbehandlerident,
                            },
                            data: {
                                __typename: 'Mutation',
                                leggTilKommentar: {
                                    __typename: 'Kommentar',
                                    id: data.data.id,
                                    tekst: tekst,
                                    opprettet: dayjs().format(ISO_DATOFORMAT),
                                    saksbehandlerident: saksbehandlerident,
                                    feilregistrert_tidspunkt: null,
                                },
                            },
                        });
                        apolloClient.cache.modify({
                            id: apolloClient.cache.identify({
                                __typename: kommentertInnhold.type,
                                id: kommentertInnhold.id,
                            }),
                            fields: {
                                kommentarer(eksisterendeKommentarer) {
                                    return [
                                        ...eksisterendeKommentarer,
                                        {
                                            __ref: apolloClient.cache.identify({
                                                __typename: 'Kommentar',
                                                id: data.data.id,
                                            }),
                                        },
                                    ];
                                },
                            },
                        });
                    },
                },
            );
            hideDialog();
        }
    };

    return {
        onLeggTilKommentar,
        loading,
        error,
    };
};

type KommentertElementType =
    | 'LagtPaVent'
    | 'EndrePaVent'
    | 'TotrinnsvurderingRetur'
    | 'StansAutomatiskBehandlingSaksbehandler'
    | 'OpphevStansAutomatiskBehandlingSaksbehandler'
    | 'Notat';

export interface KommentertElement {
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
        case PeriodehistorikkType.StansAutomatiskBehandlingSaksbehandler:
            return 'StansAutomatiskBehandlingSaksbehandler';
        case PeriodehistorikkType.OpphevStansAutomatiskBehandlingSaksbehandler:
            return 'OpphevStansAutomatiskBehandlingSaksbehandler';
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
