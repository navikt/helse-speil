import { Dayjs } from 'dayjs';

import { Kommentar } from '@io/graphql';

export type NotatSaksbehandler = {
    oid: string;
    epost: string;
    navn: string;
    ident: string;
};

export type NotatType = 'PaaVent' | 'Retur' | 'Generelt' | 'OpphevStans';

export type Notat = {
    id: string;
    tekst: string;
    saksbehandler: NotatSaksbehandler;
    opprettet: Dayjs;
    vedtaksperiodeId: string;
    feilregistrert: boolean;
    type: NotatType;
    kommentarer: Array<Kommentar>;
};
