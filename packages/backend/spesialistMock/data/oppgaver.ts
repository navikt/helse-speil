import { randomUUID } from 'crypto';

import {
    AntallArbeidsforhold,
    Egenskap,
    Kategori,
    Mottaker,
    OppgaveTilBehandling,
    Oppgaveegenskap,
    Oppgavetype,
    Periodetype,
} from '../schemaTypes';

export const oppgaver: Array<OppgaveTilBehandling> = [
    {
        id: '4680',
        vedtaksperiodeId: 'd7d208c3-a9a1-4c03-885f-aeffa4475a49',
        aktorId: '2564094783926',
        opprettet: '2022-11-02T11:09:57',
        opprinneligSoknadsdato: '2022-04-21 09:48:33.10625',
        navn: {
            fornavn: 'SLAPP',
            mellomnavn: null,
            etternavn: 'APPELSIN',
        },
        oppgavetype: Oppgavetype.Soknad,
        periodetype: Periodetype.Forstegangsbehandling,
        antallArbeidsforhold: AntallArbeidsforhold.EtArbeidsforhold,
        mottaker: Mottaker.Begge,
        egenskaper: [
            { kategori: Kategori.Periodetype, egenskap: Egenskap.Forstegangsbehandling },
            { kategori: Kategori.Oppgavetype, egenskap: Egenskap.Soknad },
            { kategori: Kategori.Mottaker, egenskap: Egenskap.DelvisRefusjon },
            { kategori: Kategori.Inntektskilde, egenskap: Egenskap.EnArbeidsgiver },
            { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Haster },
            { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Vergemal },
            { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Utland },
            { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Beslutter },
        ],
    },
    {
        id: '4420',
        vedtaksperiodeId: 'd7d208c3-a9a1-4c03-885f-aeffa4475a49',
        aktorId: '2805594640665',
        opprettet: '2023-04-02T11:09:57',
        opprinneligSoknadsdato: '2023-01-21 09:48:33.10625',
        navn: {
            fornavn: 'PUNKTLIG',
            mellomnavn: null,
            etternavn: 'JAKKE',
        },
        oppgavetype: Oppgavetype.UtbetalingTilSykmeldt,
        periodetype: Periodetype.Forstegangsbehandling,
        antallArbeidsforhold: AntallArbeidsforhold.EtArbeidsforhold,
        mottaker: Mottaker.Sykmeldt,
        egenskaper: [
            { kategori: Kategori.Periodetype, egenskap: Egenskap.Forstegangsbehandling },
            { kategori: Kategori.Oppgavetype, egenskap: Egenskap.Soknad },
            { kategori: Kategori.Mottaker, egenskap: Egenskap.UtbetalingTilSykmeldt },
            { kategori: Kategori.Inntektskilde, egenskap: Egenskap.EnArbeidsgiver },
            { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Vergemal },
        ],
    },
    {
        id: '4959',
        vedtaksperiodeId: 'beab6f33-b26b-44e1-9098-52019181c720',
        aktorId: '2348185725298',
        opprettet: '2023-01-02T11:09:57',
        opprinneligSoknadsdato: '2022-12-30 12:27:29.585667',
        navn: {
            fornavn: 'BAMES',
            mellomnavn: null,
            etternavn: 'JOND',
        },
        oppgavetype: Oppgavetype.Soknad,
        periodetype: Periodetype.Forstegangsbehandling,
        antallArbeidsforhold: AntallArbeidsforhold.EtArbeidsforhold,
        mottaker: Mottaker.Arbeidsgiver,
        egenskaper: [
            { kategori: Kategori.Periodetype, egenskap: Egenskap.Forstegangsbehandling },
            { kategori: Kategori.Oppgavetype, egenskap: Egenskap.Soknad },
            { kategori: Kategori.Mottaker, egenskap: Egenskap.UtbetalingTilArbeidsgiver },
            { kategori: Kategori.Inntektskilde, egenskap: Egenskap.EnArbeidsgiver },
            { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Spesialsak },
            { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Utland },
        ],
    },
    {
        id: '4917',
        vedtaksperiodeId: 'beab6f33-b26b-44e1-9098-52019181c720',
        aktorId: '1000001337420',
        opprettet: '2023-01-02T11:09:57',
        opprinneligSoknadsdato: '2022-12-30 12:27:29.585667',
        navn: {
            fornavn: 'OPTIMISTISK',
            mellomnavn: null,
            etternavn: 'BANAN',
        },
        oppgavetype: Oppgavetype.Soknad,
        periodetype: Periodetype.Forstegangsbehandling,
        antallArbeidsforhold: AntallArbeidsforhold.EtArbeidsforhold,
        mottaker: Mottaker.Ingen,
        egenskaper: [
            { kategori: Kategori.Periodetype, egenskap: Egenskap.Forstegangsbehandling },
            { kategori: Kategori.Oppgavetype, egenskap: Egenskap.Soknad },
            { kategori: Kategori.Mottaker, egenskap: Egenskap.IngenUtbetaling },
            { kategori: Kategori.Inntektskilde, egenskap: Egenskap.EnArbeidsgiver },
        ],
    },
    {
        id: '5917',
        vedtaksperiodeId: 'beab6f33-b26b-44e1-9098-52019181c719',
        aktorId: '1000001337421',
        opprettet: '2023-01-02T11:09:57',
        opprinneligSoknadsdato: '2022-12-30 12:27:29.585667',
        navn: {
            fornavn: 'OPTIMISTISK',
            mellomnavn: null,
            etternavn: 'BANAN',
        },
        oppgavetype: Oppgavetype.Revurdering,
        periodetype: Periodetype.Forlengelse,
        antallArbeidsforhold: AntallArbeidsforhold.FlereArbeidsforhold,
        mottaker: Mottaker.Arbeidsgiver,
        egenskaper: [
            { kategori: Kategori.Periodetype, egenskap: Egenskap.Forlengelse },
            { kategori: Kategori.Oppgavetype, egenskap: Egenskap.Revurdering },
            { kategori: Kategori.Mottaker, egenskap: Egenskap.UtbetalingTilArbeidsgiver },
            { kategori: Kategori.Inntektskilde, egenskap: Egenskap.FlereArbeidsgivere },
        ],
    },
];

export const tilfeldigeOppgaver = (antall: number) => {
    const oppgaver: OppgaveTilBehandling[] = [];
    let n = 0;
    let startId = 6000;
    while (n < antall) {
        oppgaver.push(tilfeldigOppgave(startId++));
        n++;
    }
    return oppgaver;
};

const tilfeldigOppgave = (oppgaveId: number): OppgaveTilBehandling => {
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

    const oppgavetype = Math.random() > 0.7 ? Oppgavetype.Soknad : Oppgavetype.Revurdering;
    const periodetype = tilfeldigElementFraEnum(Periodetype);
    const antallArbeidsforhold = tilfeldigElementFraEnum(AntallArbeidsforhold);
    const mottaker = tilfeldigElementFraEnum(Mottaker);

    return {
        id: oppgaveId.toString(),
        vedtaksperiodeId: randomUUID().toString(),
        aktorId: Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
        opprettet: opprettetDato,
        opprinneligSoknadsdato: søknadsDato,
        navn: {
            fornavn: fornavn,
            mellomnavn: mellomnavn,
            etternavn: etternavn,
        },
        oppgavetype: oppgavetype,
        periodetype: periodetype,
        antallArbeidsforhold: antallArbeidsforhold,
        mottaker: mottaker,
        tildeling: {
            epost: 'tildeling@epost.no',
            navn: tildelingEtternavn + ', ' + tildelingFornavn + (tildelingMellomnavn ? ' ' + tildelingMellomnavn : ''),
            reservert: false,
            paaVent: false,
            oid: randomUUID().toString(),
        },
        egenskaper: [
            egenskapFraOppgavetype(oppgavetype),
            egenskapFraPeriodetype(periodetype),
            egenskapFraMottaker(mottaker),
            egenskapFraAntallArbeidsforhold(antallArbeidsforhold),
            ...tilfeldigeUkategoriserteEgenskaper(),
        ],
    } as OppgaveTilBehandling;
};

const tilfeldigeUkategoriserteEgenskaper = () => {
    const ukategoriserteEgenskaper = [
        Math.random() > 0.5
            ? { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Beslutter }
            : { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Retur },
        Math.random() > 0.5
            ? { kategori: Kategori.Ukategorisert, egenskap: Egenskap.RiskQa }
            : { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Stikkprove },
        Math.random() > 0.5
            ? { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Vergemal }
            : { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Fullmakt },
        { kategori: Kategori.Ukategorisert, egenskap: Egenskap.EgenAnsatt },
        { kategori: Kategori.Ukategorisert, egenskap: Egenskap.FortroligAdresse },
        { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Haster },
        { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Stikkprove },
        { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Utland },
    ];
    const hvorMangeSomFjernes = Math.floor(Math.random() * ukategoriserteEgenskaper.length);
    return foo(ukategoriserteEgenskaper, hvorMangeSomFjernes);
};

const foo = (oppgaveegenskaper: Oppgaveegenskap[], antallSomSkalFjernes: number) => {
    for (let i = 0; i < antallSomSkalFjernes; i++) {
        oppgaveegenskaper.splice(Math.floor(Math.random() * oppgaveegenskaper.length), 1);
    }
    return oppgaveegenskaper;
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

const egenskapFraOppgavetype = (oppgavetype: Oppgavetype): Oppgaveegenskap => {
    switch (oppgavetype) {
        case Oppgavetype.Revurdering:
            return { kategori: Kategori.Oppgavetype, egenskap: Egenskap.Revurdering };
        case Oppgavetype.Soknad:
        default:
            return { kategori: Kategori.Oppgavetype, egenskap: Egenskap.Soknad };
    }
};

const egenskapFraPeriodetype = (periodetype: Periodetype): Oppgaveegenskap => {
    switch (periodetype) {
        case Periodetype.Forlengelse:
            return { kategori: Kategori.Periodetype, egenskap: Egenskap.Forlengelse };
        case Periodetype.Forstegangsbehandling:
            return { kategori: Kategori.Periodetype, egenskap: Egenskap.Forstegangsbehandling };
        case Periodetype.Infotrygdforlengelse:
            return { kategori: Kategori.Periodetype, egenskap: Egenskap.Infotrygdforlengelse };
        case Periodetype.OvergangFraIt:
            return { kategori: Kategori.Periodetype, egenskap: Egenskap.OvergangFraIt };
    }
};

const egenskapFraMottaker = (mottaker: Mottaker): Oppgaveegenskap => {
    switch (mottaker) {
        case Mottaker.Arbeidsgiver:
            return { kategori: Kategori.Mottaker, egenskap: Egenskap.UtbetalingTilArbeidsgiver };
        case Mottaker.Begge:
            return { kategori: Kategori.Mottaker, egenskap: Egenskap.DelvisRefusjon };
        case Mottaker.Ingen:
            return { kategori: Kategori.Mottaker, egenskap: Egenskap.IngenUtbetaling };
        case Mottaker.Sykmeldt:
            return { kategori: Kategori.Mottaker, egenskap: Egenskap.UtbetalingTilSykmeldt };
    }
};

const egenskapFraAntallArbeidsforhold = (antallArbeidsforhold: AntallArbeidsforhold): Oppgaveegenskap => {
    switch (antallArbeidsforhold) {
        case AntallArbeidsforhold.EtArbeidsforhold:
            return { kategori: Kategori.Inntektskilde, egenskap: Egenskap.EnArbeidsgiver };
        case AntallArbeidsforhold.FlereArbeidsforhold:
            return { kategori: Kategori.Inntektskilde, egenskap: Egenskap.FlereArbeidsgivere };
    }
};
