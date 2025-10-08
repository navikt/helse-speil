import { Egenskap, OppgaveProjeksjon } from '../schemaTypes';

export const oppgaveVedtaksperioder: { id: string; vedtaksperiodeId: string }[] = [
    {
        id: '4680',
        vedtaksperiodeId: 'd7d208c3-a9a1-4c03-885f-aeffa4475a49',
    },
    {
        id: '5890',
        vedtaksperiodeId: '5decb2f6-163b-469f-b733-84d9b20eb9ce',
    },
    {
        id: '44201',
        vedtaksperiodeId: '5a494c03-a9a1-08c3-885f-aeffa447d7d2',
    },
    {
        id: '4959',
        vedtaksperiodeId: 'beab6f33-b26b-44e1-9098-52019181c720',
    },
    {
        id: '4917',
        vedtaksperiodeId: 'beab6f33-b26b-44e1-9098-52019181c720',
    },
    {
        id: '5917',
        vedtaksperiodeId: 'beab6f33-b26b-44e1-9098-52019181c719',
    },
    {
        id: '90021',
        vedtaksperiodeId: 'eee7b58b-4d41-481f-ab27-a68aba84f914',
    },
];

export const oppgaver: OppgaveProjeksjon[] = [
    {
        id: '4680',
        aktorId: '2564094783926',
        opprettetTidspunkt: '2022-11-02T11:09:57',
        opprinneligSoeknadstidspunkt: '2022-04-21 09:48:33.10625',
        navn: {
            fornavn: 'SLAPP',
            mellomnavn: null,
            etternavn: 'APPELSIN',
        },
        egenskaper: [
            Egenskap.Forstegangsbehandling,
            Egenskap.Soknad,
            Egenskap.DelvisRefusjon,
            Egenskap.EnArbeidsgiver,
            Egenskap.Haster,
            Egenskap.Vergemal,
            Egenskap.Utland,
            Egenskap.ManglerIm,
            Egenskap.Beslutter,
            Egenskap.PaVent,
        ],
        paVentInfo: {
            arsaker: ['§ 8-4 Avklare aktivitetskrav/medisinske vilkår'],
            dialogRef: 1,
            opprettet: '2023-01-23T11:09:57',
            saksbehandler: 'A123456',
            tekst: 'En notattekst',
            tidsfrist: '2023-01-24',
            kommentarer: [
                {
                    id: 1,
                    opprettet: '2023-01-24T15:09:30.090206',
                    saksbehandlerident: 'A123456',
                    tekst: 'Kommentar 1',
                },
            ],
        },
    },
    {
        id: '5890',
        aktorId: '2805594640665',
        opprettetTidspunkt: '2023-04-02T11:09:57',
        opprinneligSoeknadstidspunkt: '2023-01-21 09:48:33.10625',
        navn: {
            fornavn: 'PUNKTLIG',
            mellomnavn: null,
            etternavn: 'JAKKE',
        },
        egenskaper: [
            Egenskap.PaVent,
            Egenskap.Forstegangsbehandling,
            Egenskap.Soknad,
            Egenskap.UtbetalingTilSykmeldt,
            Egenskap.EnArbeidsgiver,
            Egenskap.Vergemal,
        ],
        paVentInfo: {
            arsaker: ['Inntektsmelding - etterspurt'],
            dialogRef: 222,
            opprettet: '2023-04-02T11:09:57',
            saksbehandler: 'A123456',
            tekst: null,
            tidsfrist: '2023-02-21',
            kommentarer: [
                {
                    id: 223,
                    tekst: 'En liten kommentar',
                    opprettet: '2023-01-24T15:09:30.090206',
                    saksbehandlerident: 'A123456',
                    feilregistrert_tidspunkt: null,
                },
            ],
        },
    },
    {
        // En ganske urealistisk oppgave, for å kunne fremprovosere en graphql-error fra oppgavelista
        id: '44201',
        aktorId: '1000000000003',
        opprettetTidspunkt: '2024-04-10T11:09:57',
        opprinneligSoeknadstidspunkt: '2024-01-21 09:48:33.10625',
        navn: {
            fornavn: '',
            mellomnavn: null,
            etternavn: '',
        },
        egenskaper: [Egenskap.Forstegangsbehandling, Egenskap.Forlengelse],
    },
    {
        id: '4959',
        aktorId: '2348185725298',
        opprettetTidspunkt: '2023-01-02T11:09:57',
        opprinneligSoeknadstidspunkt: '2022-12-30 12:27:29.585667',
        navn: {
            fornavn: 'BAMES',
            mellomnavn: null,
            etternavn: 'JOND',
        },
        egenskaper: [
            Egenskap.Forstegangsbehandling,
            Egenskap.Soknad,
            Egenskap.UtbetalingTilArbeidsgiver,
            Egenskap.EnArbeidsgiver,
            Egenskap.Utland,
        ],
    },
    {
        id: '4917',
        aktorId: '1000001337420',
        opprettetTidspunkt: '2023-01-02T11:09:57',
        opprinneligSoeknadstidspunkt: '2022-12-30 12:27:29.585667',
        navn: {
            fornavn: 'OPTIMISTISK',
            mellomnavn: null,
            etternavn: 'BANAN',
        },
        egenskaper: [
            Egenskap.Forstegangsbehandling,
            Egenskap.Soknad,
            Egenskap.IngenUtbetaling,
            Egenskap.EnArbeidsgiver,
        ],
    },
    {
        id: '5917',
        aktorId: '1000001337421',
        opprettetTidspunkt: '2023-01-02T11:09:57',
        opprinneligSoeknadstidspunkt: '2022-12-30 12:27:29.585667',
        navn: {
            fornavn: 'OPTIMISTISK',
            mellomnavn: null,
            etternavn: 'BANAN',
        },
        egenskaper: [
            Egenskap.Forlengelse,
            Egenskap.Revurdering,
            Egenskap.UtbetalingTilArbeidsgiver,
            Egenskap.FlereArbeidsgivere,
        ],
    },
    {
        id: '90021',
        aktorId: '2128719010641',
        opprettetTidspunkt: '2023-07-02T11:08:58',
        opprinneligSoeknadstidspunkt: '2023-07-01 12:27:29.585667',
        navn: {
            fornavn: 'SKEPTISK',
            mellomnavn: null,
            etternavn: 'SERVICE',
        },
        egenskaper: [
            Egenskap.Forstegangsbehandling,
            Egenskap.Soknad,
            Egenskap.UtbetalingTilArbeidsgiver,
            Egenskap.EnArbeidsgiver,
        ],
        tildeling: null,
    },
];
