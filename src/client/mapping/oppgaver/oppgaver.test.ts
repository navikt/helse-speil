import { Oppgavetype, SpesialistPeriodetype, SpesialistOppgave } from '../../../types';
import { tilOppgave } from './oppgaver';
import { Periodetype, Inntektskilde } from 'internal-types';
import { SpesialistInntektskilde } from 'external-types';

describe('oppgavemapper', () => {
    test('mapper oppgave uten tildeling', () => {
        const oppgave = tilOppgave(oppgaveUtenTildeling);

        expect(oppgave.oppgavereferanse).toEqual(oppgaveUtenTildeling.oppgavereferanse);
        expect(oppgave.opprettet).toEqual(oppgaveUtenTildeling.opprettet);
        expect(oppgave.vedtaksperiodeId).toEqual(oppgaveUtenTildeling.vedtaksperiodeId);

        expect(oppgave.personinfo.fornavn).toEqual(oppgaveUtenTildeling.personinfo.fornavn);
        expect(oppgave.personinfo.mellomnavn).toEqual(oppgaveUtenTildeling.personinfo.mellomnavn);
        expect(oppgave.personinfo.etternavn).toEqual(oppgaveUtenTildeling.personinfo.etternavn);
        expect(oppgave.personinfo.fødselsdato).toEqual(null);
        expect(oppgave.personinfo.kjønn).toEqual('ukjent');

        expect(oppgave.fødselsnummer).toEqual(oppgaveUtenTildeling.fødselsnummer);
        expect(oppgave.aktørId).toEqual(oppgaveUtenTildeling.aktørId);
        expect(oppgave.antallVarsler).toEqual(oppgaveUtenTildeling.antallVarsler);
        expect(oppgave.periodetype).toEqual(Periodetype.Førstegangsbehandling);

        expect(oppgave.boenhet.id).toEqual(oppgaveUtenTildeling.boenhet.id);
        expect(oppgave.boenhet.navn).toEqual(oppgaveUtenTildeling.boenhet.navn);

        expect(oppgave.inntektskilde).toEqual(Inntektskilde.EnArbeidsgiver);
        expect(oppgave.tildeling).toEqual(undefined);
    });

    test('mapper oppgave med tildeling', () => {
        const oppgave = tilOppgave(oppgaveMedildeling);

        expect(oppgave.tildeling?.epost).toEqual('saksbehandler@nav.no');
        expect(oppgave.tildeling?.oid).toEqual('uuid');
        expect(oppgave.tildeling?.påVent).toEqual(false);
        expect(oppgave.tildeling?.navn).toEqual('saksbehandler');
    });
});

const oppgaveUtenTildeling: SpesialistOppgave = {
    oppgavetype: Oppgavetype.Søknad,
    periodeFom: '2018-02-27',
    periodeTom: '2018-03-15',
    oppgavereferanse: 'ea5d644b-0000-9999-0000-f93744554d5e',
    opprettet: '2018-02-27T08:38:00.728127',
    fødselsnummer: '21023701901',
    aktørId: '1000000009871',
    personinfo: {
        fornavn: 'Kong',
        mellomnavn: null,
        etternavn: 'Harald',
        fødselsdato: null,
        kjønn: null,
    },
    vedtaksperiodeId: 'aaaaaaaa-6541-4dcf-aa53-8b466fc4ac87',
    type: SpesialistPeriodetype.Førstegangsbehandling,
    antallVarsler: 2,
    boenhet: {
        id: '0212',
        navn: 'Alta',
    },
    inntektskilde: SpesialistInntektskilde.EnArbeidsgiver,
    tildeling: undefined,
};

const oppgaveMedildeling: SpesialistOppgave = {
    oppgavetype: Oppgavetype.Søknad,
    periodeFom: '2018-02-27',
    periodeTom: '2018-03-15',
    oppgavereferanse: 'ea5d644b-0000-9999-0000-f93744554d5e',
    opprettet: '2018-02-27T08:38:00.728127',
    fødselsnummer: '21023701901',
    aktørId: '1000000009871',
    personinfo: {
        fornavn: 'Kong',
        mellomnavn: null,
        etternavn: 'Harald',
        fødselsdato: null,
        kjønn: null,
    },
    vedtaksperiodeId: 'aaaaaaaa-6541-4dcf-aa53-8b466fc4ac87',
    type: SpesialistPeriodetype.Førstegangsbehandling,
    antallVarsler: 2,
    boenhet: {
        id: '0212',
        navn: 'Alta',
    },
    inntektskilde: SpesialistInntektskilde.EnArbeidsgiver,
    tildeling: {
        epost: 'saksbehandler@nav.no',
        oid: 'uuid',
        påVent: false,
        navn: 'saksbehandler',
    },
};
