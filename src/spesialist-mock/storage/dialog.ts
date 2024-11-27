import dayjs from 'dayjs';

import { Kommentar, Maybe } from '@spesialist-mock/schemaTypes';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { NotatMock } from '@spesialist-mock/storage/notat';

export class DialogMock {
    private static dialog: Map<number, Kommentar[]> = new Map();

    static addDialog = (dialogId: Maybe<number> = Math.floor(1000000 + Math.random() * 9000000)): Maybe<number> => {
        if (dialogId === null) return null;
        DialogMock.dialog.set(dialogId, []);
        return dialogId;
    };

    static addKommentar = (dialogId: number, kommentarProps?: Partial<Kommentar>): Kommentar => {
        const mockedKommentar = DialogMock.getMockedKommentar(kommentarProps);
        DialogMock.dialog.set(dialogId, [...DialogMock.getKommentarer(dialogId), mockedKommentar]);

        const historikkinnslag = HistorikkinnslagMock.getHistorikkinnslagMedDialogId(dialogId);

        if (historikkinnslag) {
            HistorikkinnslagMock.updateHistorikkinnslag(HistorikkinnslagMock.findKeyByDialogId(dialogId)!!, dialogId, {
                kommentarer: DialogMock.getKommentarer(dialogId),
            });
        } else {
            const notat = NotatMock.getNotatMedDialogId(dialogId);
            if (notat) {
                NotatMock.updateNotat(notat.vedtaksperiodeId, notat.id, {
                    kommentarer: DialogMock.getKommentarer(dialogId),
                });
            }
        }
        return mockedKommentar;
    };

    static addKommentarer = (dialogId: number, kommentarer: Kommentar[]) =>
        DialogMock.dialog.set(dialogId, [...DialogMock.getKommentarer(dialogId), ...kommentarer]);

    static getKommentarer = (dialogId: number): Kommentar[] => DialogMock.dialog.get(dialogId) ?? [];

    private static getMockedKommentar = (overrides?: Partial<Kommentar>): Kommentar => ({
        id: Math.floor(1000000 + Math.random() * 9000000),
        tekst: 'mocked kommentar',
        opprettet: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        saksbehandlerident: 'A123456',
        feilregistrert_tidspunkt: null,
        ...overrides,
    });
}
