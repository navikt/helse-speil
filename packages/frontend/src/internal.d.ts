declare type Dayjs = import('dayjs').Dayjs;

declare type Saksbehandler = {
    oid: string;
    epost: string;
    navn: string;
    ident?: string;
    isLoggedIn?: boolean;
};

declare type NotatType = 'PaaVent' | 'Retur' | 'Generelt' | 'OpphevStans';

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
    | 'FERDIGBEHANDLET_GODKJENNINGSBEHOV'
    | 'UTBETALING_ANNULLERING_OK'
    | 'NY_SAKSBEHANDLEROPPGAVE'
    | 'REVURDERING_FERDIGBEHANDLET'
    | 'REVURDERING_AVVIST'
    | 'PERSONDATA_OPPDATERT';

declare type Opptegnelse = {
    aktørId: number;
    sekvensnummer: number;
    type: OpptegnelseType;
    payload: string;
};
