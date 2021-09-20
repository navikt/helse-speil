import dayjs from 'dayjs';
import { Oppgavetype, SpesialistInntektskilde, SpesialistOppgave } from 'external-types';

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

export const inntektskilde = (inntektskilde?: SpesialistInntektskilde): Inntektskilde => {
    switch (inntektskilde) {
        case SpesialistInntektskilde.EnArbeidsgiver:
            return 'EN_ARBEIDSGIVER';
        case SpesialistInntektskilde.FlereArbeidsgivere:
            return 'FLERE_ARBEIDSGIVERE';
        default:
            return 'EN_ARBEIDSGIVER';
    }
};

export const tilOppgave = (oppgave: SpesialistOppgave): Oppgave => ({
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
    },
    fødselsnummer: oppgave.fødselsnummer,
    aktørId: oppgave.aktørId,
    antallVarsler: oppgave.antallVarsler,
    periodetype:
        oppgave.oppgavetype === Oppgavetype.Stikkprøve
            ? 'stikkprøve'
            : oppgave.oppgavetype === Oppgavetype.RiskQa
            ? 'riskQa'
            : oppgave.oppgavetype === Oppgavetype.Revurdering
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
