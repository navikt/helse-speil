import { AntallArbeidsforhold, BehandletOppgave, Oppgavetype, Periodetype } from '../schemaTypes';

export const behandledeOppgaver: BehandletOppgave[] = [
    {
        id: '4347',
        aktorId: '2564094783926',
        personPseudoId: 'c7b71860-6629-45d9-8ec2-82c781a5fee0',
        ferdigstiltAv: 'Utvikler, Lokal',
        saksbehandler: 'A123456',
        beslutter: null,
        ferdigstiltTidspunkt: '2025-04-15T08:54:18.301013',
        antallArbeidsforhold: AntallArbeidsforhold.FlereArbeidsforhold,
        periodetype: Periodetype.Forstegangsbehandling,
        oppgavetype: Oppgavetype.Soknad,
        personnavn: { fornavn: 'Aggressiv', mellomnavn: null, etternavn: 'Agurk' },
    },
    {
        id: '4348',
        aktorId: '2564094783926',
        personPseudoId: 'acf338da-e30b-4bfe-8d28-912c979f1e04',
        ferdigstiltAv: 'Saksbehandler, Annen',
        saksbehandler: 'B654321',
        beslutter: 'A123456',
        ferdigstiltTidspunkt: '2025-04-14T09:41:55.590219',
        antallArbeidsforhold: AntallArbeidsforhold.EtArbeidsforhold,
        periodetype: Periodetype.Forstegangsbehandling,
        oppgavetype: Oppgavetype.Revurdering,
        personnavn: { fornavn: 'Passiv', mellomnavn: null, etternavn: 'Aubergine' },
    },
];
