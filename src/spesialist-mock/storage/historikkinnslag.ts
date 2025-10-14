import dayjs from 'dayjs';

import {
    EndrePaVent,
    FjernetFraPaVent,
    Historikkinnslag,
    Kommentar,
    LagtPaVent,
    OpphevStansAutomatiskBehandlingSaksbehandler,
    PeriodeHistorikkElementNy,
    PeriodehistorikkType,
    StansAutomatiskBehandlingSaksbehandler,
    TotrinnsvurderingRetur,
} from '@spesialist-mock/schemaTypes';
import { findVedtaksperiodeId } from '@spesialist-mock/storage/notat';
import { UUID } from '@typer/spesialist-mock';

export type HistorikkinnslagUnion =
    | LagtPaVent
    | EndrePaVent
    | FjernetFraPaVent
    | TotrinnsvurderingRetur
    | StansAutomatiskBehandlingSaksbehandler
    | OpphevStansAutomatiskBehandlingSaksbehandler
    | PeriodeHistorikkElementNy;
export type HistorikkinnslagMedKommentarer =
    | LagtPaVent
    | EndrePaVent
    | TotrinnsvurderingRetur
    | StansAutomatiskBehandlingSaksbehandler
    | OpphevStansAutomatiskBehandlingSaksbehandler;

export class HistorikkinnslagMock {
    private static historikkinnslagMap: Map<UUID, Array<HistorikkinnslagUnion>> = new Map();
    private static historikkinnslagCounter: number = 0;

    static addHistorikkinnslag = (id: string, historikkinnslagProps?: Partial<HistorikkinnslagUnion>) => {
        const vedtaksperiodeId = findVedtaksperiodeId(id) ?? id;
        const historikkinnslag = HistorikkinnslagMock.getMockedHistorikkinnslag(historikkinnslagProps);
        HistorikkinnslagMock.historikkinnslagMap.set(vedtaksperiodeId, [
            ...HistorikkinnslagMock.getHistorikkinnslag(vedtaksperiodeId),
            historikkinnslag,
        ]);
    };

    static getHistorikkinnslag = (vedtaksperiodeId: UUID): HistorikkinnslagUnion[] =>
        HistorikkinnslagMock.historikkinnslagMap.get(vedtaksperiodeId) ?? [];

    static getHistorikkinnslagMedDialogId = (dialogId: number): HistorikkinnslagMedKommentarer | undefined =>
        Array.from(HistorikkinnslagMock.historikkinnslagMap.values())
            .flat()
            .find((h) => h.dialogRef === dialogId) as HistorikkinnslagMedKommentarer;

    static getSisteLagtPåVentHistorikkinnslag = (vedtaksperiodeId: UUID): HistorikkinnslagUnion | null => {
        const historikkinnslag = HistorikkinnslagMock.historikkinnslagMap.get(vedtaksperiodeId);
        if (!historikkinnslag) return null;
        return historikkinnslag[historikkinnslag.length - 1] ?? null;
    };

    static updateHistorikkinnslag = (id: string, dialogId: number, overrides: Partial<HistorikkinnslagUnion>): void => {
        const vedtaksperiodeId = findVedtaksperiodeId(id) ?? id;
        HistorikkinnslagMock.historikkinnslagMap.set(
            vedtaksperiodeId,
            HistorikkinnslagMock.getHistorikkinnslag(vedtaksperiodeId).map((h) =>
                h.dialogRef === dialogId ? { ...h, ...overrides } : h,
            ) as HistorikkinnslagUnion[],
        );
    };

    static findKeyByDialogId = (dialogId: number) => {
        for (const [key, values] of HistorikkinnslagMock.historikkinnslagMap.entries()) {
            if (Array.isArray(values) && values.find((h) => h.dialogRef === dialogId)) {
                return key;
            }
        }
        return null;
    };

    private static getMockedHistorikkinnslag = (overrides?: Partial<Historikkinnslag>): HistorikkinnslagUnion => ({
        id: HistorikkinnslagMock.historikkinnslagCounter++,
        type: PeriodehistorikkType.LeggPaVent,
        saksbehandlerIdent: 'A123456',
        timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        dialogRef: null,
        frist: null,
        notattekst: null,
        arsaker: [] as string[],
        kommentarer: [] as Kommentar[],
        ...overrides,
    });
}
