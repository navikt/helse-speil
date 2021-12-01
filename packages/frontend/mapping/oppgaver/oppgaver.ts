import dayjs from 'dayjs';

import { tilPeriodetype } from '../periodetype';

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

export const inntektskilde = (inntektskilde?: ExternalVedtaksperiode['inntektskilde']): Inntektskilde =>
    inntektskilde && ['EN_ARBEIDSGIVER', 'FLERE_ARBEIDSGIVERE'].includes(inntektskilde)
        ? inntektskilde
        : 'EN_ARBEIDSGIVER';

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
        adressebeskyttelse: 'Ugradert',
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
});
