import { AntallArbeidsforhold, BehandletOppgave, Oppgavetype, Periodetype } from '../schemaTypes';

export const behandledeOppgaver: BehandletOppgave[] = [
    {
        id: '4347',
        aktorId: '2564094783926',
        ferdigstiltAv: 'Utvikler, Lokal',
        ferdigstiltTidspunkt: '2022-09-12T08:54:18.301013',
        antallArbeidsforhold: AntallArbeidsforhold.FlereArbeidsforhold,
        periodetype: Periodetype.Forstegangsbehandling,
        oppgavetype: Oppgavetype.Soknad,
        personnavn: { fornavn: 'Aggressiv', mellomnavn: null, etternavn: 'Agurk' },
    },
    {
        id: '4348',
        aktorId: '2564094783926',
        ferdigstiltAv: 'Saksbehandler, Annen',
        ferdigstiltTidspunkt: '2022-09-12T09:41:55.590219',
        antallArbeidsforhold: AntallArbeidsforhold.EtArbeidsforhold,
        periodetype: Periodetype.Forstegangsbehandling,
        oppgavetype: Oppgavetype.Revurdering,
        personnavn: { fornavn: 'Passiv', mellomnavn: null, etternavn: 'Aubergine' },
    },
];
