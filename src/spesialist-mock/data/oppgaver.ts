import {
    AntallArbeidsforhold,
    Egenskap,
    Kategori,
    Mottaker,
    OppgaveTilBehandling,
    Oppgavetype,
    Periodetype,
} from '../schemaTypes';

export const oppgaver: OppgaveTilBehandling[] = [
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
            { kategori: Kategori.Status, egenskap: Egenskap.Beslutter },
            { kategori: Kategori.Status, egenskap: Egenskap.PaVent },
        ],
    },
    {
        id: '4420',
        vedtaksperiodeId: '5decb2f6-163b-469f-b733-84d9b20eb9ce',
        aktorId: '2805594640665',
        opprettet: '2023-04-02T11:09:57',
        opprinneligSoknadsdato: '2023-01-21 09:48:33.10625',
        navn: {
            fornavn: 'PUNKTLIG',
            mellomnavn: null,
            etternavn: 'JAKKE',
        },
        oppgavetype: Oppgavetype.Soknad,
        periodetype: Periodetype.Forstegangsbehandling,
        antallArbeidsforhold: AntallArbeidsforhold.EtArbeidsforhold,
        mottaker: Mottaker.Sykmeldt,
        egenskaper: [
            { kategori: Kategori.Status, egenskap: Egenskap.PaVent },
            { kategori: Kategori.Periodetype, egenskap: Egenskap.Forstegangsbehandling },
            { kategori: Kategori.Oppgavetype, egenskap: Egenskap.Soknad },
            { kategori: Kategori.Mottaker, egenskap: Egenskap.UtbetalingTilSykmeldt },
            { kategori: Kategori.Inntektskilde, egenskap: Egenskap.EnArbeidsgiver },
            { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Vergemal },
        ],
    },
    {
        // En ganske urealistisk oppgave, for å kunne fremprovosere en graphql-error fra oppgavelista
        id: '44201',
        vedtaksperiodeId: '5a494c03-a9a1-08c3-885f-aeffa447d7d2',
        aktorId: '9001',
        opprettet: '2024-04-10T11:09:57',
        opprinneligSoknadsdato: '2024-01-21 09:48:33.10625',
        navn: {
            fornavn: '',
            mellomnavn: null,
            etternavn: '',
        },
        oppgavetype: Oppgavetype.Soknad,
        periodetype: Periodetype.OvergangFraIt,
        antallArbeidsforhold: AntallArbeidsforhold.EtArbeidsforhold,
        mottaker: Mottaker.Sykmeldt,
        egenskaper: [
            { kategori: Kategori.Periodetype, egenskap: Egenskap.Forstegangsbehandling },
            { kategori: Kategori.Periodetype, egenskap: Egenskap.Forlengelse },
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
    {
        aktorId: '2128719010641',
        egenskaper: [
            { kategori: Kategori.Periodetype, egenskap: Egenskap.Forstegangsbehandling },
            { kategori: Kategori.Oppgavetype, egenskap: Egenskap.Soknad },
            { kategori: Kategori.Mottaker, egenskap: Egenskap.UtbetalingTilArbeidsgiver },
            { kategori: Kategori.Inntektskilde, egenskap: Egenskap.EnArbeidsgiver },
        ],
        navn: {
            fornavn: 'SKEPTISK',
            mellomnavn: null,
            etternavn: 'SERVICE',
        },
        id: '90021',
        opprettet: '2023-07-02T11:08:58',
        opprinneligSoknadsdato: '2023-07-01 12:27:29.585667',
        tildeling: null,
        vedtaksperiodeId: 'eee7b58b-4d41-481f-ab27-a68aba84f914',
        oppgavetype: Oppgavetype.Soknad,
        periodetype: Periodetype.Forstegangsbehandling,
        mottaker: Mottaker.Arbeidsgiver,
        antallArbeidsforhold: AntallArbeidsforhold.EtArbeidsforhold,
    },
];
