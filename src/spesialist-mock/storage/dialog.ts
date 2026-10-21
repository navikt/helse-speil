import dayjs from 'dayjs';

import { ApiSaksbildeKommentar } from '@io/rest/generated/spesialist.schemas';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { NotatMock } from '@spesialist-mock/storage/notat';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

export class DialogMock {
    private static dialog: Map<number, ApiSaksbildeKommentar[]> = new Map();

    static addDialog = (dialogId: number | null = Math.floor(1000000 + Math.random() * 9000000)): number | null => {
        if (dialogId === null) return null;
        DialogMock.dialog.set(dialogId, []);
        return dialogId;
    };

    static addKommentar = (
        dialogId: number,
        kommentarProps?: Partial<ApiSaksbildeKommentar>,
    ): ApiSaksbildeKommentar => {
        const mockedKommentar = DialogMock.getMockedKommentar(kommentarProps);
        DialogMock.dialog.set(dialogId, [...DialogMock.getKommentarer(dialogId), mockedKommentar]);

        DialogMock.oppdaterKommentarIMock(dialogId);
        return mockedKommentar;
    };

    static addKommentarer = (dialogId: number, kommentarer: ApiSaksbildeKommentar[]) =>
        DialogMock.dialog.set(dialogId, [...DialogMock.getKommentarer(dialogId), ...kommentarer]);

    static getKommentarer = (dialogId: number): ApiSaksbildeKommentar[] => DialogMock.dialog.get(dialogId) ?? [];

    static feilregistrerKommentar(dialogId: number, kommentarId: number) {
        DialogMock.dialog.set(
            dialogId,
            DialogMock.getKommentarer(dialogId).map((kommentar) =>
                kommentar.id === kommentarId
                    ? { ...kommentar, feilregistrert_tidspunkt: dayjs().format(ISO_TIDSPUNKTFORMAT) }
                    : kommentar,
            ),
        );
        DialogMock.oppdaterKommentarIMock(dialogId);
    }

    private static oppdaterKommentarIMock(dialogId: number) {
        const historikkinnslag = HistorikkinnslagMock.getHistorikkinnslagMedDialogId(dialogId);
        const id = HistorikkinnslagMock.findKeyByDialogId(dialogId);

        if (historikkinnslag && id) {
            HistorikkinnslagMock.updateHistorikkinnslag(id, dialogId, {
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
    }

    private static getMockedKommentar = (overrides?: Partial<ApiSaksbildeKommentar>): ApiSaksbildeKommentar => ({
        id: Math.floor(1000000 + Math.random() * 9000000),
        tekst: 'mocked kommentar',
        opprettet: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        saksbehandlerident: 'A123456',
        feilregistrert_tidspunkt: null,
        ...overrides,
    });
}
