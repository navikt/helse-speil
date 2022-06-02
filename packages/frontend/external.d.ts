declare type ExternalPersoninfo = {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    fødselsdato: DateString | null;
    kjønn: string | null;
    adressebeskyttelse: 'Ugradert' | 'Fortrolig';
};

declare type ExternalTildeling = {
    oid: string;
    epost: string;
    påVent: boolean;
    navn: string;
};

declare type ExternalPeriodetype =
    | 'FORLENGELSE'
    | 'FØRSTEGANGSBEHANDLING'
    | 'INFOTRYGDFORLENGELSE'
    | 'OVERGANG_FRA_IT'
    | 'STIKKPRØVE'
    | 'RISK_QA'
    | 'REVURDERING'
    | 'FORTROLIG_ADRESSE'
    | 'UTBETALING_TIL_SYKMELDT'
    | 'DELVIS_REFUSJON';

declare type ExternalBehandlingstatistikk = {
    antallOppgaverTilGodkjenning: {
        totalt: number;
        perPeriodetype: [{ periodetypeForSpeil: ExternalPeriodetype; antall: number }];
    };
    antallTildelteOppgaver: {
        totalt: number;
        perPeriodetype: [{ periodetypeForSpeil: ExternalPeriodetype; antall: number }];
    };
    fullførteBehandlinger: {
        totalt: number;
        manuelt: {
            totalt: number;
            perPeriodetype: [{ periodetypeForSpeil: ExternalPeriodetype; antall: number }];
        };
        automatisk: number;
        annulleringer: number;
    };
};

declare type ExternalOppgavetype =
    | 'SØKNAD'
    | 'STIKKPRØVE'
    | 'RISK_QA'
    | 'REVURDERING'
    | 'FORTROLIG_ADRESSE'
    | 'UTBETALING_TIL_SYKMELDT'
    | 'DELVIS_REFUSJON';

declare type ExternalOppgave = {
    oppgavereferanse: string;
    opprettet: string;
    vedtaksperiodeId: string;
    personinfo: ExternalPersoninfo;
    fødselsnummer: string;
    aktørId: string;
    antallVarsler: number;
    type: ExternalPeriodetype;
    oppgavetype: ExternalOppgavetype;
    boenhet: {
        id: string;
        navn: string;
    };
    inntektskilde?: 'EN_ARBEIDSGIVER' | 'FLERE_ARBEIDSGIVERE';
    tildeling?: ExternalTildeling;
    erBeslutterOppgave: boolean;
    erReturOppgave: boolean;
    trengerTotrinnsvurdering: boolean;
    tidligereSaksbehandlerOid: string;
};

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
