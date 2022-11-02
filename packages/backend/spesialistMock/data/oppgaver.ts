import { Adressebeskyttelse, Kjonn, OppgaveForOversiktsvisning, Oppgavetype, Periodetype } from '../schemaTypes';

export const oppgaver: Array<OppgaveForOversiktsvisning> = [
    {
        id: '4680',
        type: Oppgavetype.Soknad,
        opprettet: '2022-11-02T11:09:57',
        vedtaksperiodeId: 'd7d208c3-a9a1-4c03-885f-aeffa4475a49',
        personinfo: {
            fornavn: 'SLAPP',
            mellomnavn: null,
            etternavn: 'APPELSIN',
            fodselsdato: '1986-02-06',
            kjonn: Kjonn.Kvinne,
            adressebeskyttelse: Adressebeskyttelse.Ugradert,
        },
        fodselsnummer: '06028620819',
        aktorId: '2564094783926',
        antallVarsler: 3,
        periodetype: Periodetype.Forstegangsbehandling,
        flereArbeidsgivere: false,
        boenhet: {
            id: '1401',
            navn: 'Flora',
        },
        tildeling: null,
        erBeslutter: false,
        erRetur: false,
        tidligereSaksbehandler: null,
        trengerTotrinnsvurdering: false,
    },
];
