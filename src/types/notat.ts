import { Dayjs } from 'dayjs';

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
    kommentarer: Kommentar[];
};

export type Kommentar = {
    id: number;
    opprettet: string;
    saksbehandlerident: string;
    tekst: string;
    feilregistrert_tidspunkt: string | undefined;
};
