import { ApiFagomrade } from '@io/rest/generated/sporhund.schemas';

// Placeholder until sporhund oppgave-listing endpoint is defined and Orval types are generated
export type DialogmeldingMeldingstype = 'FORESPORSEL' | 'SVAR' | 'NOTAT';

export type DialogmeldingStatus = 'UBEHANDLET' | 'UNDER_BEHANDLING' | 'FERDIG';

export interface DialogmeldingOppgave {
    id: string;
    personPseudoId: string;
    dato: string;
    frist: string;
    fagomrade: ApiFagomrade;
    soker: string;
    meldingstype: DialogmeldingMeldingstype;
    status: DialogmeldingStatus;
}
