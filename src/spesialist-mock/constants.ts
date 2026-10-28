import type { ApiTildeling } from '@io/rest/generated/spesialist.schemas';

export const sleep = (ms: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

export const antallTilfeldigeOppgaver = 0;
export const antallTilfeldigeBehandledeOppgaver = 0;

export const lokalSaksbehandlerOid = '11111111-2222-3333-4444-555555555555';
export const lokalSaksbehandlerNavn = 'Utvikler, Lokal';
export const lokalSaksbehandlerIdent = 'A123456';

export const lokalTildeling: ApiTildeling = {
    epost: 'epost@nav.no',
    navn: lokalSaksbehandlerNavn,
    oid: lokalSaksbehandlerOid,
};
