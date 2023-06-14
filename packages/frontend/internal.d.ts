declare type Dayjs = import('dayjs').Dayjs;

declare type Saksbehandler = {
    oid: string;
    epost: string;
    navn: string;
    ident?: string;
    isLoggedIn?: boolean;
};

declare type NotatType = 'PaaVent' | 'Retur' | 'Generelt';

declare type Notat = {
    id: string;
    tekst: string;
    saksbehandler: Saksbehandler;
    opprettet: Dayjs;
    vedtaksperiodeId: string;
    feilregistrert: boolean;
    type: NotatType;
    kommentarer: Array<Kommentar>;
};

declare type OpptegnelseType =
    | 'UTBETALING_ANNULLERING_FEILET'
    | 'UTBETALING_ANNULLERING_OK'
    | 'NY_SAKSBEHANDLEROPPGAVE'
    | 'REVURDERING_FERDIGBEHANDLET'
    | 'PERSONDATA_OPPDATERT';

declare type Opptegnelse = {
    aktørId: number;
    sekvensnummer: number;
    type: OpptegnelseType;
    payload: string;
};
