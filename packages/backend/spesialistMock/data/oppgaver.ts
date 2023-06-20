import { randomUUID } from 'crypto';

import {
    Adressebeskyttelse,
    Kjonn,
    Mottaker,
    OppgaveForOversiktsvisning,
    Oppgavetype,
    Periodetype,
} from '../schemaTypes';

export const oppgaver: Array<OppgaveForOversiktsvisning> = [
    {
        id: '4680',
        type: Oppgavetype.Soknad,
        opprettet: '2022-11-02T11:09:57',
        opprinneligSoknadsdato: '2022-04-21 09:48:33.10625',
        vedtaksperiodeId: 'd7d208c3-a9a1-4c03-885f-aeffa4475a49',
        personinfo: {
            fornavn: 'SLAPP',
            mellomnavn: null,
            etternavn: 'APPELSIN',
            fodselsdato: '1986-02-06',
            kjonn: Kjonn.Kvinne,
            adressebeskyttelse: Adressebeskyttelse.Ugradert,
        },
        navn: {
            fornavn: 'SLAPP',
            mellomnavn: null,
            etternavn: 'APPELSIN',
        },
        fodselsnummer: '06028620819',
        aktorId: '2564094783926',
        periodetype: Periodetype.Forstegangsbehandling,
        flereArbeidsgivere: false,
        boenhet: {
            id: '1401',
            navn: 'Flora',
        },
        totrinnsvurdering: {
            erBeslutteroppgave: true,
            erRetur: false,
        },
        mottaker: Mottaker.Arbeidsgiver,
        haster: true,
    },
    {
        id: '4420',
        type: Oppgavetype.Soknad,
        opprettet: '2023-04-02T11:09:57',
        opprinneligSoknadsdato: '2023-01-21 09:48:33.10625',
        vedtaksperiodeId: 'd7d208c3-a9a1-4c03-885f-aeffa4475a49',
        personinfo: {
            fornavn: 'PUNKTLIG',
            mellomnavn: null,
            etternavn: 'JAKKE',
            fodselsdato: '1984-11-07',
            kjonn: Kjonn.Mann,
            adressebeskyttelse: Adressebeskyttelse.Ugradert,
        },
        navn: {
            fornavn: 'PUNKTLIG',
            mellomnavn: null,
            etternavn: 'JAKKE',
        },
        fodselsnummer: '07518405122',
        aktorId: '2805594640665',
        periodetype: Periodetype.Forstegangsbehandling,
        flereArbeidsgivere: false,
        boenhet: {
            id: '1122',
            navn: 'Gjesdal',
        },
        mottaker: Mottaker.Arbeidsgiver,
    },
    {
        id: '4959',
        type: Oppgavetype.Soknad,
        opprettet: '2023-01-02T11:09:57',
        opprinneligSoknadsdato: '2022-12-30 12:27:29.585667',
        vedtaksperiodeId: 'beab6f33-b26b-44e1-9098-52019181c720',
        personinfo: {
            fornavn: 'BAMES',
            mellomnavn: null,
            etternavn: 'JOND',
            fodselsdato: '1991-01-17',
            kjonn: Kjonn.Mann,
            adressebeskyttelse: Adressebeskyttelse.Ugradert,
        },
        navn: {
            fornavn: 'BAMES',
            mellomnavn: null,
            etternavn: 'JOND',
        },
        fodselsnummer: '57419121128',
        aktorId: '2348185725298',
        periodetype: Periodetype.Forstegangsbehandling,
        flereArbeidsgivere: false,
        boenhet: {
            id: '0393',
            navn: 'NAV oppfølging utland',
        },
        mottaker: Mottaker.Arbeidsgiver,
    },
    {
        id: '4917',
        type: Oppgavetype.Soknad,
        opprettet: '2023-01-02T11:09:57',
        opprinneligSoknadsdato: '2022-12-30 12:27:29.585667',
        vedtaksperiodeId: 'beab6f33-b26b-44e1-9098-52019181c720',
        personinfo: {
            fornavn: 'OPTIMISTISK',
            mellomnavn: null,
            etternavn: 'BANAN',
            fodselsdato: '1991-01-17',
            kjonn: Kjonn.Mann,
            adressebeskyttelse: Adressebeskyttelse.Ugradert,
        },
        navn: {
            fornavn: 'OPTIMISTISK',
            mellomnavn: null,
            etternavn: 'BANAN',
        },
        fodselsnummer: '12345678910',
        aktorId: '1000001337420',
        periodetype: Periodetype.Forstegangsbehandling,
        flereArbeidsgivere: false,
        boenhet: {
            id: '0393',
            navn: 'NAV oppfølging utland',
        },
        mottaker: null,
    },
    {
        id: '5917',
        type: Oppgavetype.Soknad,
        opprettet: '2023-01-02T11:09:57',
        opprinneligSoknadsdato: '2022-12-30 12:27:29.585667',
        vedtaksperiodeId: 'beab6f33-b26b-44e1-9098-52019181c719',
        personinfo: {
            fornavn: 'OPTIMISTISK',
            mellomnavn: null,
            etternavn: 'BANAN',
            fodselsdato: '1991-01-17',
            kjonn: Kjonn.Mann,
            adressebeskyttelse: Adressebeskyttelse.Ugradert,
        },
        navn: {
            fornavn: 'OPTIMISTISK',
            mellomnavn: null,
            etternavn: 'BANAN',
        },
        fodselsnummer: '12345678911',
        aktorId: '1000001337421',
        periodetype: Periodetype.Forstegangsbehandling,
        flereArbeidsgivere: false,
        boenhet: {
            id: '0393',
            navn: 'NAV oppfølging utland',
        },
        mottaker: Mottaker.Arbeidsgiver,
    },
];

export const tilfeldigeOppgaver = (antall: number) => {
    const oppgaver: OppgaveForOversiktsvisning[] = [];
    let n = 0;
    let startId = 6000;
    while (n < antall) {
        oppgaver.push(tilfeldigOppgave(startId++));
        n++;
    }
    return oppgaver;
};

const tilfeldigOppgave = (oppgaveId: number): OppgaveForOversiktsvisning => {
    const fornavn = tilfeldigFornavn();
    const mellomnavn = tilfeldigMellomnavn();
    const etternavn = tilfeldigEtternavn();

    const tildelingFornavn = tilfeldigFornavn();
    const tildelingMellomnavn = tilfeldigMellomnavn();
    const tildelingEtternavn = tilfeldigEtternavn();

    const dato = tilfeldigDato();
    const opprettetDato = dato.toISOString();
    dato.setDate(dato.getDate() - Math.floor(1 + Math.random() * 31));
    const søknadsDato = dato.toISOString();

    return {
        id: oppgaveId.toString(),
        type: tilfeldigElementFraEnum(Oppgavetype),
        opprettet: opprettetDato,
        opprinneligSoknadsdato: søknadsDato,
        vedtaksperiodeId: randomUUID().toString(),
        personinfo: {
            fornavn: fornavn,
            mellomnavn: mellomnavn,
            etternavn: etternavn,
            fodselsdato: '1970-01-01',
            kjonn: tilfeldigElementFraEnum(Kjonn),
            adressebeskyttelse: Adressebeskyttelse.Ugradert,
        },
        navn: {
            fornavn: fornavn,
            mellomnavn: mellomnavn,
            etternavn: etternavn,
        },
        fodselsnummer: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
        aktorId: Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
        periodetype: tilfeldigElementFraEnum(Periodetype),
        flereArbeidsgivere: Math.random() < 0.5,
        boenhet: {
            id: '0393',
            navn: 'NAV oppfølging utland',
        },
        mottaker: tilfeldigElementFraEnum(Mottaker),
        tildeling: {
            epost: 'tildeling@epost.no',
            navn: tildelingEtternavn + ', ' + tildelingFornavn + (tildelingMellomnavn ? ' ' + tildelingMellomnavn : ''),
            reservert: false,
            paaVent: false,
            oid: randomUUID().toString(),
        },
    } as OppgaveForOversiktsvisning;
};

const tilfeldigDato = () => {
    const start = new Date(2022, 0, 1);
    return new Date(start.getTime() + Math.random() * (new Date().getTime() - start.getTime()));
};

const tilfeldigElementFraEnum = <T extends { [key: number]: string | number }>(e: T): T[keyof T] => {
    const keys = Object.keys(e);

    const randomKeyIndex = Math.floor(Math.random() * keys.length);
    const randomKey = keys[randomKeyIndex];

    const randomKeyNumber = Number(randomKey);
    return isNaN(randomKeyNumber) ? e[randomKey as keyof T] : (randomKeyNumber as unknown as T[keyof T]);
};

const tilfeldigFornavn = () => {
    const fornavnListe = ['Røff', 'Kul', 'Snill', 'Lat', 'Perfekt', 'Enorm', 'Ekkel'];
    return tilfeldigNavn(fornavnListe);
};

const tilfeldigMellomnavn = () => {
    const mellomnavnListe = ['Rar', 'Teit', 'Spesiell', 'Fantastisk', 'Tullete', 'Fabelaktig', null, null, null];
    return tilfeldigNavn(mellomnavnListe);
};

const tilfeldigEtternavn = () => {
    const etternavnListe = ['Paraply', 'Frosk', 'Øgle', 'Flaske', 'Dør', 'Pensjonist', 'Sykkel'];
    return tilfeldigNavn(etternavnListe);
};

const tilfeldigNavn = (navneliste: (string | null)[]) => {
    return navneliste[Math.floor(Math.random() * navneliste.length)];
};
