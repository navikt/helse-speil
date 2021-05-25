import dayjs from 'dayjs';
import { Oppgavetype, SpesialistInntektskilde, SpesialistOppgave } from 'external-types';
import { Inntektskilde, Kjønn, Oppgave, Periodetype } from 'internal-types';

import { tilPeriodetype } from '../periodetype';

const kjønn = (kjønn: string | null): Kjønn => {
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
            return Inntektskilde.EnArbeidsgiver;
        case SpesialistInntektskilde.FlereArbeidsgivere:
            return Inntektskilde.FlereArbeidsgivere;
        default:
            return Inntektskilde.EnArbeidsgiver;
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
            ? Periodetype.Stikkprøve
            : oppgave.oppgavetype === Oppgavetype.RiskQa
            ? Periodetype.RiskQa
            : oppgave.oppgavetype === Oppgavetype.Revurdering
            ? Periodetype.Revurdering
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
