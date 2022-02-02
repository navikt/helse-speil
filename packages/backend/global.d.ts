declare type ExternalPersoninfo = {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    kjønn: string | null;
    fødselsdato: string | null;
};

declare type ExternalPeriodetype =
    | 'FORLENGELSE'
    | 'FØRSTEGANGSBEHANDLING'
    | 'INFOTRYGDFORLENGELSE'
    | 'OVERGANG_FRA_IT'
    | 'STIKKPRØVE'
    | 'RISK_QA';

declare type ExternalOppgavetype = 'SØKNAD' | 'STIKKPRØVE' | 'RISK_QA' | 'REVURDERING' | 'UTBETALING_TIL_SYKMELDT';

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
};
