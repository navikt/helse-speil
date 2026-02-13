import { Dayjs } from 'dayjs';

import { ApiNotatType } from '@io/rest/generated/spesialist.schemas';

export type KladdNotatType = (typeof KladdNotatType)[keyof typeof KladdNotatType];

// I frontend types notater som lagres i en kladdeting med alle fire typer, ikke bare de to som støttes av spesialist
export const KladdNotatType = {
    ...ApiNotatType,
    PaaVent: 'PaaVent',
    Retur: 'Retur',
} as const;

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
