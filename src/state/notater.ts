import dayjs from 'dayjs';
import { atom, useAtom } from 'jotai';

import { NotatFragment, NotatType, PeriodehistorikkType } from '@io/graphql';
import { Notat } from '@typer/notat';

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

type KommentertElementType =
    | 'LagtPaVent'
    | 'EndrePaVent'
    | 'TotrinnsvurderingRetur'
    | 'StansAutomatiskBehandlingSaksbehandler'
    | 'OpphevStansAutomatiskBehandlingSaksbehandler'
    | 'Notat';

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
