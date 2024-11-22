import dayjs from 'dayjs';

import {
    FjernetFraPaVent,
    Historikkinnslag,
    LagtPaVent,
    Maybe,
    PeriodeHistorikkElementNy,
    PeriodehistorikkType,
    TotrinnsvurderingRetur,
} from '@spesialist-mock/schemaTypes';
import { findVedtaksperiodeId } from '@spesialist-mock/storage/notat';
import { UUID } from '@typer/spesialist-mock';

type HistorikkinnslagUnion = LagtPaVent | FjernetFraPaVent | TotrinnsvurderingRetur | PeriodeHistorikkElementNy;

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

    static getSisteLagtPåVentHistorikkinnslag = (vedtaksperiodeId: UUID): Maybe<HistorikkinnslagUnion> => {
        const historikkinnslag = HistorikkinnslagMock.historikkinnslagMap.get(vedtaksperiodeId);
        if (!historikkinnslag) return null;
        return historikkinnslag[historikkinnslag.length - 1] ?? null;
    };

    private static getMockedHistorikkinnslag = (overrides?: Partial<Historikkinnslag>): HistorikkinnslagUnion => {
        return {
            id: HistorikkinnslagMock.historikkinnslagCounter++,
            type: PeriodehistorikkType.LeggPaVent,
            saksbehandlerIdent: 'A123456',
            timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            dialogRef: null,
            frist: null,
            notattekst: null,
            arsaker: [],
            kommentarer: [],
            ...overrides,
        };
    };
}
