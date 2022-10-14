declare type ExternalNotatType = 'PaaVent' | 'Retur' | 'Generelt';

declare type ExternalNotat = {
    id: string;
    tekst: string;
    opprettet: string;
    saksbehandlerOid: string;
    saksbehandlerNavn: string;
    saksbehandlerEpost: string;
    vedtaksperiodeId: string;
    feilregistrert: boolean;
    saksbehandlerIdent?: string;
    type: ExternalNotatType;
};
