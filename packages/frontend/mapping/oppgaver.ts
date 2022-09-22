import dayjs from 'dayjs';

const kjønn = (kjønn: string | null): 'mann' | 'kvinne' | 'ukjent' => {
    if (!kjønn) return 'ukjent';
    switch (kjønn.toLowerCase()) {
        case 'mann':
            return 'mann';
        case 'kvinne':
            return 'kvinne';
        default:
            return 'ukjent';
    }
};

export const inntektskilde = (inntektskilde?: 'EN_ARBEIDSGIVER' | 'FLERE_ARBEIDSGIVERE'): Inntektskilde =>
    inntektskilde && ['EN_ARBEIDSGIVER', 'FLERE_ARBEIDSGIVERE'].includes(inntektskilde)
        ? inntektskilde
        : 'EN_ARBEIDSGIVER';

export const tilPeriodetype = (type: ExternalPeriodetype): Periodetype => {
    switch (type) {
        case 'FORLENGELSE':
            return 'forlengelse';
        case 'FØRSTEGANGSBEHANDLING':
            return 'førstegangsbehandling';
        case 'INFOTRYGDFORLENGELSE':
            return 'infotrygdforlengelse';
        case 'OVERGANG_FRA_IT':
            return 'overgangFraIt';
        case 'STIKKPRØVE':
            return 'stikkprøve';
        case 'RISK_QA':
            return 'riskQa';
        case 'REVURDERING':
            return 'revurdering';
        case 'FORTROLIG_ADRESSE':
            return 'fortroligAdresse';
        case 'UTBETALING_TIL_SYKMELDT':
            return 'utbetalingTilSykmeldt';
        case 'DELVIS_REFUSJON':
            return 'delvisRefusjon';
    }
};
export const tilOppgave = (oppgave: ExternalOppgave): Oppgave => ({
    oppgavereferanse: oppgave.oppgavereferanse,
    opprettet: oppgave.opprettet,
    vedtaksperiodeId: oppgave.vedtaksperiodeId,
    personinfo: {
        fornavn: oppgave.personinfo.fornavn,
        mellomnavn: oppgave.personinfo.mellomnavn,
        etternavn: oppgave.personinfo.etternavn,
        kjønn: kjønn(oppgave.personinfo.kjønn),
        fødselsdato: oppgave.personinfo.fødselsdato ? dayjs(oppgave.personinfo.fødselsdato) : null,
        fnr: undefined,
        adressebeskyttelse: oppgave.personinfo.adressebeskyttelse,
    },
    fødselsnummer: oppgave.fødselsnummer,
    aktørId: oppgave.aktørId,
    antallVarsler: oppgave.antallVarsler,
    periodetype:
        oppgave.oppgavetype === 'STIKKPRØVE'
            ? 'stikkprøve'
            : oppgave.oppgavetype === 'RISK_QA'
            ? 'riskQa'
            : oppgave.oppgavetype === 'REVURDERING'
            ? 'revurdering'
            : oppgave.oppgavetype === 'FORTROLIG_ADRESSE'
            ? 'fortroligAdresse'
            : oppgave.oppgavetype === 'UTBETALING_TIL_SYKMELDT'
            ? 'utbetalingTilSykmeldt'
            : oppgave.oppgavetype === 'DELVIS_REFUSJON'
            ? 'delvisRefusjon'
            : tilPeriodetype(oppgave.type),
    boenhet: oppgave.boenhet,
    inntektskilde: inntektskilde(oppgave.inntektskilde),
    tildeling: oppgave.tildeling
        ? {
              saksbehandler: {
                  epost: oppgave.tildeling.epost,
                  oid: oppgave.tildeling.oid,
                  navn: oppgave.tildeling.navn,
              },
              påVent: oppgave.tildeling.påVent,
          }
        : undefined,
    erBeslutterOppgave: oppgave.erBeslutterOppgave,
    erReturOppgave: oppgave.erReturOppgave,
    trengerTotrinnsvurdering: oppgave.trengerTotrinnsvurdering,
    tidligereSaksbehandlerOid: oppgave.tidligereSaksbehandlerOid,
    sistSendt: oppgave.sistSendt,
});
