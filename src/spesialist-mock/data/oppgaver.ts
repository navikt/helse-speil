import { ApiEgenskap, ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { lokalSaksbehandlerIdent, lokalTildeling } from '@spesialist-mock/constants';

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
        id: '6890',
        vedtaksperiodeId: '61788607-2448-432f-9d8a-5991fa3047f3',
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
        id: '5343',
        vedtaksperiodeId: '546cb550-bcd0-4b95-abc0-d17bf6818bf7',
    },
    {
        id: '1669',
        vedtaksperiodeId: '77b462eb-0d6a-4ce1-a30f-107adccccaf4',
    },
    {
        id: '4104',
        vedtaksperiodeId: '7bfc1bf7-4e95-49a4-bf94-2fe0c17f93ff',
    },
    {
        id: '4788',
        vedtaksperiodeId: 'eace1b7f-5c4e-46c0-886a-002e806de583',
    },
];

export const oppgaver: ApiOppgaveProjeksjon[] = [
    {
        id: '4680',
        personPseudoId: '', // id-en injectes i syncMock
        aktorId: '2564094783926',
        opprettetTidspunkt: '2025-11-02T11:09:57',
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
            ApiEgenskap.PA_VENT,
        ],
        tildeling: lokalTildeling,
        påVentInfo: {
            arsaker: ['§ 8-4 Avklare aktivitetskrav/medisinske vilkår'],
            dialogRef: 1,
            opprettet: '2023-01-23T11:09:57',
            saksbehandler: lokalSaksbehandlerIdent,
            tekst: 'En notattekst',
            tidsfrist: '2023-01-24',
            kommentarer: [
                {
                    id: 1,
                    opprettet: '2023-01-24T15:09:30.090206',
                    saksbehandlerident: lokalSaksbehandlerIdent,
                    tekst: 'Kommentar 1',
                },
            ],
        },
    },
    {
        id: '5890',
        personPseudoId: '', // id-en injectes i syncMock
        aktorId: '2805594640665',
        opprettetTidspunkt: '2023-04-02T11:09:57',
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
        tildeling: lokalTildeling,
        påVentInfo: {
            arsaker: ['Inntektsmelding - etterspurt'],
            dialogRef: 222,
            opprettet: '2023-04-02T11:09:57',
            saksbehandler: lokalSaksbehandlerIdent,
            tekst: null,
            tidsfrist: '2023-02-21',
            kommentarer: [
                {
                    id: 223,
                    tekst: 'En liten kommentar',
                    opprettet: '2023-01-24T15:09:30.090206',
                    saksbehandlerident: lokalSaksbehandlerIdent,
                    feilregistrert_tidspunkt: null,
                },
            ],
        },
    },
    {
        id: '6890',
        personPseudoId: '', // id-en injectes i syncMock
        aktorId: '2805594640777',
        opprettetTidspunkt: '2023-04-03T11:09:57',
        behandlingOpprettetTidspunkt: '2022-04-19 09:48:33.10625',
        navn: {
            fornavn: 'STRENG',
            mellomnavn: null,
            etternavn: 'KAKTUS',
        },
        egenskaper: [
            ApiEgenskap.FORSTEGANGSBEHANDLING,
            ApiEgenskap.SOKNAD,
            ApiEgenskap.UTBETALING_TIL_SYKMELDT,
            ApiEgenskap.EN_ARBEIDSGIVER,
        ],
    },
    {
        // En ganske urealistisk oppgave, for å kunne fremprovosere en feil fra oppgavelista
        id: '44201',
        personPseudoId: '', // id-en injectes i syncMock
        aktorId: '1000000000003',
        opprettetTidspunkt: '2024-04-10T11:09:57',
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
        personPseudoId: '', // id-en injectes i syncMock
        aktorId: '2348185725298',
        opprettetTidspunkt: '2023-01-02T11:09:57',
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
        personPseudoId: '', // id-en injectes i syncMock
        aktorId: '1000001337420',
        opprettetTidspunkt: '2023-01-02T11:09:57',
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
        id: '5343',
        personPseudoId: '', // id-en injectes i syncMock
        aktorId: '2407074650987',
        opprettetTidspunkt: '2023-01-02T11:09:57',
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
        id: '1669',
        personPseudoId: '', // id-en injectes i syncMock
        aktorId: '2117136462117',
        opprettetTidspunkt: '2023-07-02T11:08:58',
        behandlingOpprettetTidspunkt: '2022-04-19 09:48:33.10625',
        navn: {
            fornavn: 'SINDIG',
            mellomnavn: null,
            etternavn: 'GLOBUS',
        },
        egenskaper: [
            ApiEgenskap.FORSTEGANGSBEHANDLING,
            ApiEgenskap.SOKNAD,
            ApiEgenskap.UTBETALING_TIL_ARBEIDSGIVER,
            ApiEgenskap.EN_ARBEIDSGIVER,
        ],
        tildeling: null,
    },
    {
        id: '4104',
        personPseudoId: '', // id-en injectes i syncMock
        aktorId: '2948505693240',
        opprettetTidspunkt: '2025-09-25T12:42:28',
        behandlingOpprettetTidspunkt: '2025-09-25 12:42:28.697712',
        navn: {
            fornavn: 'KVART',
            mellomnavn: null,
            etternavn: 'ARBEIDSKRAFT',
        },
        egenskaper: [
            ApiEgenskap.FORSTEGANGSBEHANDLING,
            ApiEgenskap.SOKNAD,
            ApiEgenskap.UTBETALING_TIL_SYKMELDT,
            ApiEgenskap.EN_ARBEIDSGIVER,
            ApiEgenskap.SELVSTENDIG_NAERINGSDRIVENDE,
        ],
    },
    {
        id: '4788',
        personPseudoId: '', // id-en injectes i syncMock
        aktorId: '2037105535448',
        opprettetTidspunkt: '2025-12-16T10:58:54',
        behandlingOpprettetTidspunkt: '2025-12-16 10:58:54.387439',
        navn: {
            fornavn: 'NYSGJERRIG',
            mellomnavn: null,
            etternavn: 'AKTØR',
        },
        egenskaper: [
            ApiEgenskap.FORSTEGANGSBEHANDLING,
            ApiEgenskap.SOKNAD,
            ApiEgenskap.UTBETALING_TIL_SYKMELDT,
            ApiEgenskap.EN_ARBEIDSGIVER,
            ApiEgenskap.SELVSTENDIG_NAERINGSDRIVENDE,
            ApiEgenskap.JORDBRUKER_REINDRIFT,
        ],
    },
];
