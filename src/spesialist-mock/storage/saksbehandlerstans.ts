import dayjs from 'dayjs';

import { ApiSaksbehandlerStans } from '@io/rest/generated/spesialist.schemas';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

export class SaksbehandlerStansMock {
    private static saksbehandlerstans: Map<string, ApiSaksbehandlerStans> = new Map();

    static getStans = (pseudoId: string): ApiSaksbehandlerStans => {
        return (
            SaksbehandlerStansMock.saksbehandlerstans.get(pseudoId) ?? {
                erStanset: false,
                begrunnelse: null,
                opprettetTidspunkt: null,
                utførtAv: null,
            }
        );
    };

    static opprettStans = (pseudoId: string, begrunnelse: string, utførtAv: string): void => {
        SaksbehandlerStansMock.saksbehandlerstans.set(pseudoId, {
            erStanset: true,
            utførtAv: utførtAv,
            opprettetTidspunkt: dayjs().format(ISO_TIDSPUNKTFORMAT),
            begrunnelse: begrunnelse,
        });
    };

    static opphevStans = (pseudoId: string): void => {
        SaksbehandlerStansMock.saksbehandlerstans.set(pseudoId, {
            erStanset: false,
            begrunnelse: null,
            opprettetTidspunkt: null,
            utførtAv: null,
        });
    };
}
