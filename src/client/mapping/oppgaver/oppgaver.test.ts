import { tilOppgave } from './oppgaver';
import { Periodetype, Inntektskilde } from 'internal-types';
import { Oppgavetype, SpesialistInntektskilde, SpesialistOppgave, SpesialistPeriodetype } from 'external-types';

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

        expect(oppgave.tildeling?.saksbehandler.epost).toEqual('saksbehandler@nav.no');
        expect(oppgave.tildeling?.saksbehandler.oid).toEqual('uuid');
        expect(oppgave.tildeling?.saksbehandler.navn).toEqual('saksbehandler');
        expect(oppgave.tildeling?.påVent).toEqual(false);
    });
});

const oppgaveUtenTildeling: SpesialistOppgave = {
    oppgavetype: Oppgavetype.Søknad,
    oppgavereferanse: '123',
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
    oppgavereferanse: '123',
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
