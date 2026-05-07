import dayjs from 'dayjs';

import { ApiBehandlerDialog, ApiNyDialogmelding } from '@io/rest/generated/sporhund.schemas';
import { testBehandlere } from '@saksbilde/dialogmelding/testdata';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

export class DialogmeldingMock {
    private static behandlere: ApiBehandlerDialog[] = structuredClone(testBehandlere);

    static getAll = (): ApiBehandlerDialog[] => {
        return DialogmeldingMock.behandlere;
    };

    static addDialogmelding = (data: ApiNyDialogmelding): ApiBehandlerDialog => {
        const tid = dayjs().format(ISO_TIDSPUNKTFORMAT);
        const tittel = data.type === 'L8' ? 'Tilleggsopplysninger (L8)' : 'Legeerklæring (L40)';

        let behandler = DialogmeldingMock.behandlere.find((b) => b.behandlerId === data.behandlerId);

        if (!behandler) {
            behandler = {
                behandlerId: data.behandlerId,
                behandlernavn: data.behandlernavn,
                dialoger: [],
            };
            DialogmeldingMock.behandlere.push(behandler);
        }

        behandler.dialoger.unshift({
            id: crypto.randomUUID(),
            tittel,
            tid,
            dialogmeldinger: [
                {
                    tittel,
                    melding: data.melding,
                    tid,
                    fraNav: true,
                    vedlegg: [],
                },
            ],
        });

        return behandler;
    };
}
