import { ApiEgenskap, ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';

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

export const oppgaver: ApiOppgaveProjeksjon[] = [
    {
        id: '4680',
        personPseudoId: '75dc6e54-b8e2-45b8-a9e0-48c018c613a4',
        aktorId: '2564094783926',
        opprettetTidspunkt: '2025-11-02T11:09:57',
        opprinneligSoeknadstidspunkt: '2025-10-21 09:48:33.10625',
        behandlingOpprettetTidspunkt: '2025-10-19 09:48:33.10625',
        navn: {
            fornavn: 'SLAPP',
            mellomnavn: null,
            etternavn: 'APPELSIN',
        },
        egenskaper: [
            ApiEgenskap.FORSTEGANGSBEHANDLING,
            ApiEgenskap.SOKNAD,
            ApiEgenskap.DELVIS_REFUSJON,
            ApiEgenskap.EN_ARBEIDSGIVER,
            ApiEgenskap.HASTER,
            ApiEgenskap.VERGEMAL,
            ApiEgenskap.UTLAND,
            ApiEgenskap.MANGLER_IM,
            ApiEgenskap.BESLUTTER,
            ApiEgenskap.PA_VENT,
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
        personPseudoId: '7afe562b-8984-4b8c-bfd3-b5f4a5bf4718',
        aktorId: '2805594640665',
        opprettetTidspunkt: '2023-04-02T11:09:57',
        opprinneligSoeknadstidspunkt: '2023-01-21 09:48:33.10625',
        behandlingOpprettetTidspunkt: '2022-04-19 09:48:33.10625',
        navn: {
            fornavn: 'PUNKTLIG',
            mellomnavn: null,
            etternavn: 'JAKKE',
        },
        egenskaper: [
            ApiEgenskap.PA_VENT,
            ApiEgenskap.FORSTEGANGSBEHANDLING,
            ApiEgenskap.SOKNAD,
            ApiEgenskap.UTBETALING_TIL_SYKMELDT,
            ApiEgenskap.EN_ARBEIDSGIVER,
            ApiEgenskap.VERGEMAL,
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
        personPseudoId: 'b99b7845-f892-484c-b1d8-e070d2821bb6',
        aktorId: '1000000000003',
        opprettetTidspunkt: '2024-04-10T11:09:57',
        opprinneligSoeknadstidspunkt: '2024-01-21 09:48:33.10625',
        behandlingOpprettetTidspunkt: '2022-04-19 09:48:33.10625',
        navn: {
            fornavn: '',
            mellomnavn: null,
            etternavn: '',
        },
        egenskaper: [ApiEgenskap.FORSTEGANGSBEHANDLING, ApiEgenskap.FORLENGELSE],
    },
    {
        id: '4959',
        personPseudoId: '2d1bc122-bbfc-4338-b2e9-f0fa4fbad2ba',
        aktorId: '2348185725298',
        opprettetTidspunkt: '2023-01-02T11:09:57',
        opprinneligSoeknadstidspunkt: '2022-12-30 12:27:29.585667',
        behandlingOpprettetTidspunkt: '2022-04-19 09:48:33.10625',
        navn: {
            fornavn: 'BAMES',
            mellomnavn: null,
            etternavn: 'JOND',
        },
        egenskaper: [
            ApiEgenskap.FORSTEGANGSBEHANDLING,
            ApiEgenskap.SOKNAD,
            ApiEgenskap.UTBETALING_TIL_ARBEIDSGIVER,
            ApiEgenskap.EN_ARBEIDSGIVER,
            ApiEgenskap.UTLAND,
        ],
    },
    {
        id: '4917',
        personPseudoId: 'f3f2afdf-fe55-4f6c-b77a-38c15de1642d',
        aktorId: '1000001337420',
        opprettetTidspunkt: '2023-01-02T11:09:57',
        opprinneligSoeknadstidspunkt: '2022-12-30 12:27:29.585667',
        behandlingOpprettetTidspunkt: '2022-04-19 09:48:33.10625',
        navn: {
            fornavn: 'OPTIMISTISK',
            mellomnavn: null,
            etternavn: 'BANAN',
        },
        egenskaper: [
            ApiEgenskap.FORSTEGANGSBEHANDLING,
            ApiEgenskap.SOKNAD,
            ApiEgenskap.INGEN_UTBETALING,
            ApiEgenskap.EN_ARBEIDSGIVER,
        ],
    },
    {
        id: '5917',
        personPseudoId: '951269d2-c272-4c64-9fa7-f25eac943c59',
        aktorId: '2407074650987',
        opprettetTidspunkt: '2023-01-02T11:09:57',
        opprinneligSoeknadstidspunkt: '2022-12-30 12:27:29.585667',
        behandlingOpprettetTidspunkt: '2022-04-19 09:48:33.10625',
        navn: {
            fornavn: 'OPTIMISTISK',
            mellomnavn: null,
            etternavn: 'BANAN',
        },
        egenskaper: [
            ApiEgenskap.FORLENGELSE,
            ApiEgenskap.REVURDERING,
            ApiEgenskap.UTBETALING_TIL_ARBEIDSGIVER,
            ApiEgenskap.FLERE_ARBEIDSGIVERE,
        ],
    },
    {
        id: '90021',
        personPseudoId: '62a99893-299d-41ef-9ef4-7f3454a1a9ab',
        aktorId: '2117136462117',
        opprettetTidspunkt: '2023-07-02T11:08:58',
        opprinneligSoeknadstidspunkt: '2023-07-01 12:27:29.585667',
        behandlingOpprettetTidspunkt: '2022-04-19 09:48:33.10625',
        navn: {
            fornavn: 'SKEPTISK',
            mellomnavn: null,
            etternavn: 'SERVICE',
        },
        egenskaper: [
            ApiEgenskap.FORSTEGANGSBEHANDLING,
            ApiEgenskap.SOKNAD,
            ApiEgenskap.UTBETALING_TIL_ARBEIDSGIVER,
            ApiEgenskap.EN_ARBEIDSGIVER,
        ],
        tildeling: null,
    },
];
