import dayjs from 'dayjs';

import {
    ApiEndrePaVent,
    ApiHistorikkinnslag,
    ApiLagtPaVent,
    ApiOpphevStansAutomatiskBehandlingSaksbehandler,
    ApiPeriodehistorikkType,
    ApiStansAutomatiskBehandlingSaksbehandler,
    ApiTotrinnsvurderingRetur,
} from '@io/rest/generated/spesialist.schemas';
import { findVedtaksperiodeId } from '@spesialist-mock/storage/notat';
import { UUID } from '@typer/spesialist-mock';

export type HistorikkinnslagMedKommentarer =
    | ApiLagtPaVent
    | ApiEndrePaVent
    | ApiTotrinnsvurderingRetur
    | ApiStansAutomatiskBehandlingSaksbehandler
    | ApiOpphevStansAutomatiskBehandlingSaksbehandler;

// Typen (discriminatoren) utledes av historikktype
export type HistorikkinnslagFelter = Partial<Omit<ApiLagtPaVent, 'type'>>;

export class HistorikkinnslagMock {
    private static historikkinnslagMap: Map<UUID, ApiHistorikkinnslag[]> = new Map();
    private static historikkinnslagCounter: number = 0;

    static addHistorikkinnslag = (id: string, historikkinnslagProps?: HistorikkinnslagFelter) => {
        const vedtaksperiodeId = findVedtaksperiodeId(id) ?? id;
        const historikkinnslag = HistorikkinnslagMock.getMockedHistorikkinnslag(historikkinnslagProps);
        HistorikkinnslagMock.historikkinnslagMap.set(vedtaksperiodeId, [
            ...HistorikkinnslagMock.getHistorikkinnslag(vedtaksperiodeId),
            historikkinnslag,
        ]);
    };

    static getHistorikkinnslag = (vedtaksperiodeId: UUID): ApiHistorikkinnslag[] =>
        HistorikkinnslagMock.historikkinnslagMap.get(vedtaksperiodeId) ?? [];

    static getHistorikkinnslagMedDialogId = (dialogId: number): HistorikkinnslagMedKommentarer | undefined =>
        Array.from(HistorikkinnslagMock.historikkinnslagMap.values())
            .flat()
            .find((h) => h.dialogRef === dialogId) as HistorikkinnslagMedKommentarer;

    static getSisteLagtPåVentHistorikkinnslag = (vedtaksperiodeId: UUID): ApiHistorikkinnslag | null => {
        const historikkinnslag = HistorikkinnslagMock.historikkinnslagMap.get(vedtaksperiodeId);
        if (!historikkinnslag) return null;
        return historikkinnslag[historikkinnslag.length - 1] ?? null;
    };

    static updateHistorikkinnslag = (id: string, dialogId: number, overrides: HistorikkinnslagFelter): void => {
        const vedtaksperiodeId = findVedtaksperiodeId(id) ?? id;
        HistorikkinnslagMock.historikkinnslagMap.set(
            vedtaksperiodeId,
            HistorikkinnslagMock.getHistorikkinnslag(vedtaksperiodeId).map((h) =>
                h.dialogRef === dialogId ? ({ ...h, ...overrides } as ApiHistorikkinnslag) : h,
            ),
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

    static nullstill = (): void => {
        HistorikkinnslagMock.historikkinnslagMap.clear();
    };

    private static getMockedHistorikkinnslag = (overrides?: HistorikkinnslagFelter): ApiHistorikkinnslag => {
        const historikkinnslag = {
            id: HistorikkinnslagMock.historikkinnslagCounter++,
            historikktype: ApiPeriodehistorikkType.LEGG_PA_VENT,
            saksbehandlerIdent: 'A123456',
            timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            dialogRef: null,
            frist: null,
            notattekst: null,
            arsaker: [] as string[],
            kommentarer: [],
            ...overrides,
        };
        return {
            ...historikkinnslag,
            type: historikkinnslagtype(historikkinnslag.historikktype),
        } as ApiHistorikkinnslag;
    };
}

function historikkinnslagtype(historikktype: ApiPeriodehistorikkType): ApiHistorikkinnslag['type'] {
    switch (historikktype) {
        case ApiPeriodehistorikkType.LEGG_PA_VENT:
            return 'ApiLagtPaVent';
        case ApiPeriodehistorikkType.ENDRE_PA_VENT:
            return 'ApiEndrePaVent';
        case ApiPeriodehistorikkType.FJERN_FRA_PA_VENT:
            return 'ApiFjernetFraPaVent';
        case ApiPeriodehistorikkType.TOTRINNSVURDERING_RETUR:
            return 'ApiTotrinnsvurderingRetur';
        case ApiPeriodehistorikkType.STANS_AUTOMATISK_BEHANDLING_SAKSBEHANDLER:
            return 'ApiStansAutomatiskBehandlingSaksbehandler';
        case ApiPeriodehistorikkType.OPPHEV_STANS_AUTOMATISK_BEHANDLING_SAKSBEHANDLER:
            return 'ApiOpphevStansAutomatiskBehandlingSaksbehandler';
        default:
            return 'ApiPeriodeHistorikkElementNy';
    }
}
