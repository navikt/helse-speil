import { Dayjs } from 'dayjs';

import { Kommentar } from '@io/graphql';

export type NotatSaksbehandler = {
    oid: string;
    epost: string;
    navn: string;
    ident: string;
};

export type Notat = {
    id: string;
    dialogRef: number;
    tekst: string;
    saksbehandler: NotatSaksbehandler;
    opprettet: Dayjs;
    vedtaksperiodeId: string;
    feilregistrert: boolean;
    erOpphevStans: boolean;
    kommentarer: Array<Kommentar>;
};
