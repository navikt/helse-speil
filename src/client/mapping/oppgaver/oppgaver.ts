import { Inntektskilde, Kjønn, Oppgave, Periodetype } from 'internal-types';
import { Oppgavetype, SpesialistPeriodetype, SpesialistOppgave } from '../../../types';
import dayjs from 'dayjs';
import { SpesialistInntektskilde } from 'external-types';

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

const periodeType = (type: SpesialistPeriodetype) => {
    switch (type) {
        case SpesialistPeriodetype.Forlengelse:
            return Periodetype.Forlengelse;
        case SpesialistPeriodetype.Førstegangsbehandling:
            return Periodetype.Førstegangsbehandling;
        case SpesialistPeriodetype.Infotrygdforlengelse:
            return Periodetype.Infotrygdforlengelse;
        case SpesialistPeriodetype.OvergangFraInfotrygd:
            return Periodetype.OvergangFraInfotrygd;
        case SpesialistPeriodetype.Stikkprøve:
            return Periodetype.Stikkprøve;
        case SpesialistPeriodetype.RiskQa:
            return Periodetype.RiskQa;
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
            : periodeType(oppgave.type),
    boenhet: oppgave.boenhet,
    inntektskilde: inntektskilde(oppgave.inntektskilde),
    tildeling: oppgave.tildeling
        ? {
              epost: oppgave.tildeling.epost,
              oid: oppgave.tildeling.oid,
              påVent: oppgave.tildeling.påVent,
              navn: oppgave.tildeling.navn,
          }
        : undefined,
});
