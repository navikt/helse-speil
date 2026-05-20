import dayjs from 'dayjs';

import {
    ApiBehandler,
    ApiBehandlerKategori,
    ApiDialogDetails,
    ApiDialogOppsummering,
    ApiDialogmelding,
    ApiDialogmeldingType,
    ApiFagomrade,
    ApiNyDialogmelding,
    ApiSvarPaDialog,
} from '@io/rest/generated/sporhund.schemas';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

interface InternalDialog {
    conversationRef: string;
    behandler: ApiBehandler;
    tid: string;
    dialogmeldinger: ApiDialogmelding[];
}

const mockBehandler1: ApiBehandler = {
    id: 'behandlerId-1',
    kategori: ApiBehandlerKategori.LEGE,
    navn: { fornavn: 'Linus', etternavn: 'Haugen', mellomnavn: null },
    legekontor: {
        kontor: 'Legesenteret',
        orgnummer: '123456789',
        adresse: 'Storgata 1',
        postnummer: '0182',
        poststed: 'Oslo',
    },
};

const mockBehandler2: ApiBehandler = {
    id: 'behandlerId-2',
    kategori: ApiBehandlerKategori.LEGE,
    navn: { fornavn: 'Solveig', etternavn: 'Bakke', mellomnavn: null },
    legekontor: { kontor: 'Legesenteret', orgnummer: null, adresse: null, postnummer: null, poststed: null },
};

const mockBehandler3: ApiBehandler = {
    id: 'behandlerId-3',
    kategori: ApiBehandlerKategori.LEGE,
    navn: { fornavn: 'Christian', etternavn: 'Strand', mellomnavn: null },
    legekontor: {
        kontor: 'Legesenteret',
        orgnummer: null,
        adresse: 'Kirkegata 12',
        postnummer: '7030',
        poststed: 'Trondheim',
    },
};

const initialDialoger: InternalDialog[] = [
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440001',
        behandler: mockBehandler1,
        tid: '2026-04-24T14:36:00',
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding:
                    'Takk for tilsendt dokumentasjon. Vi trenger noen tilleggsopplysninger om pasientens funksjonsnivå og eventuelle tilretteleggingsmuligheter på arbeidsplassen. Kan dere gi en nærmere vurdering av dette?',
                tid: '2026-04-24T14:36:00',
                fraNav: true,
                vedlegg: [],
            },
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding:
                    'Hei, vedlagt finner dere den forespurte dokumentasjonen. Jeg har lagt ved relevant journaldokumentasjon og vurdering av pasientens tilstand. Ta gjerne kontakt dersom dere trenger ytterligere opplysninger.',
                tid: '2026-04-22T07:21:00',
                fraNav: false,
                vedlegg: [
                    { navn: 'Sykmelding.pdf', url: '#' },
                    { navn: 'Legeerklæring.pdf', url: '#' },
                    { navn: 'Journal_2024.pdf', url: '#' },
                ],
            },
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding:
                    'Hei, vi behandler saken til Mia Cathrine Svendsen og trenger ytterligere dokumentasjon for å kunne fatte et vedtak. Kan dere sende over relevant dokumentasjon som belyser pasientens tilstand og arbeidsevne?',
                tid: '2026-04-20T09:15:00',
                fraNav: true,
                vedlegg: [],
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440002',
        behandler: mockBehandler1,
        tid: '2026-04-20T08:30:00',
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.ENKELTSTAENDE_BEHANDLINGSDAGER,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding: 'Vi ønsker en oppdatering på pasientens tilstand og forventet varighet på sykmeldingen.',
                tid: '2026-04-20T08:30:00',
                fraNav: true,
                vedlegg: [],
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440003',
        behandler: mockBehandler2,
        tid: '2026-04-24T14:36:00',
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.BESTRIDELSE,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding: 'Vi ber om dokumentasjon knyttet til pasientens diagnose og behandlingsplan.',
                tid: '2026-04-24T14:36:00',
                fraNav: true,
                vedlegg: [],
            },
            {
                fagomrade: ApiFagomrade.BESTRIDELSE,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding: 'Vedlagt sender jeg etterspurt dokumentasjon.',
                tid: '2026-04-23T10:49:00',
                fraNav: false,
                vedlegg: [{ navn: 'Dokumentasjon.pdf', url: '#' }],
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440004',
        behandler: mockBehandler3,
        tid: '2026-04-10T09:00:00',
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.YRKESSKADE,
                meldingstype: ApiDialogmeldingType.SPESIALISTERKLAERING,
                melding: 'Vi ønsker mer informasjon om diagnosen og prognosen for tilbakekomst til arbeid.',
                tid: '2026-04-10T09:00:00',
                fraNav: true,
                vedlegg: [],
            },
            {
                fagomrade: ApiFagomrade.YRKESSKADE,
                meldingstype: ApiDialogmeldingType.SPESIALISTERKLAERING,
                melding:
                    'Pasienten er sykmeldt grunnet rygglidelse. Prognosen er god, forventet tilbakekomst om 6–8 uker.',
                tid: '2026-04-08T13:15:00',
                fraNav: false,
                vedlegg: [{ navn: 'Sykmelding.pdf', url: '#' }],
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440005',
        behandler: mockBehandler3,
        tid: '2026-04-05T11:00:00',
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding:
                    'Kan dere gi en vurdering av pasientens nåværende arbeidsevne og muligheter for gradert sykmelding?',
                tid: '2026-04-05T11:00:00',
                fraNav: true,
                vedlegg: [],
            },
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding:
                    'Pasienten kan på det nåværende tidspunkt ikke benytte seg av gradert sykmelding, men vi vil revurdere dette om 2 uker.',
                tid: '2026-04-04T10:00:00',
                fraNav: false,
                vedlegg: [{ navn: 'Vurdering.pdf', url: '#' }],
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440006',
        behandler: mockBehandler3,
        tid: '2026-03-28T14:00:00',
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.ENKELTSTAENDE_BEHANDLINGSDAGER,
                meldingstype: ApiDialogmeldingType.SPESIALISTERKLAERING,
                melding: 'Vi ber om bekreftelse på at behandlingsplanen er iverksatt.',
                tid: '2026-03-28T14:00:00',
                fraNav: true,
                vedlegg: [],
            },
        ],
    },
];

export class DialogmeldingMock {
    private static dialoger: InternalDialog[] = structuredClone(initialDialoger);

    static getAll = (): ApiDialogOppsummering[] => {
        return DialogmeldingMock.dialoger.map((dialog) => {
            const first = dialog.dialogmeldinger[0]!;
            return {
                conversationRef: dialog.conversationRef,
                behandler: dialog.behandler,
                fagomrade: first.fagomrade,
                meldingstype: first.meldingstype,
                tid: dialog.tid,
                antallMeldinger: dialog.dialogmeldinger.length,
                antallVedlegg: dialog.dialogmeldinger.reduce((sum, m) => sum + m.vedlegg.length, 0),
            };
        });
    };

    static getById = (dialogId: string): ApiDialogDetails | null => {
        const dialog = DialogmeldingMock.dialoger.find((d) => d.conversationRef === dialogId);
        if (!dialog) return null;
        return {
            conversationRef: dialog.conversationRef,
            behandler: dialog.behandler,
            tid: dialog.tid,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };

    static addDialogmelding = (data: ApiNyDialogmelding): ApiDialogDetails => {
        const tid = dayjs().format(ISO_TIDSPUNKTFORMAT);
        const conversationRef = crypto.randomUUID();

        const dialog: InternalDialog = {
            conversationRef,
            behandler: data.behandler,
            tid,
            dialogmeldinger: [
                {
                    fagomrade: data.fagomrade,
                    meldingstype: data.meldingstype,
                    melding: data.melding,
                    tid,
                    fraNav: true,
                    vedlegg: [],
                },
            ],
        };

        DialogmeldingMock.dialoger.unshift(dialog);

        return {
            conversationRef: dialog.conversationRef,
            behandler: dialog.behandler,
            tid: dialog.tid,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };

    static addSvar = (dialogId: string, data: ApiSvarPaDialog): ApiDialogDetails | null => {
        const dialog = DialogmeldingMock.dialoger.find((d) => d.conversationRef === dialogId);
        if (!dialog) return null;

        const tid = dayjs().format(ISO_TIDSPUNKTFORMAT);
        const first = dialog.dialogmeldinger[0]!;
        dialog.dialogmeldinger.unshift({
            fagomrade: first.fagomrade,
            meldingstype: first.meldingstype,
            melding: data.melding,
            tid,
            fraNav: true,
            vedlegg: [],
        });
        dialog.tid = tid;

        return {
            conversationRef: dialog.conversationRef,
            behandler: dialog.behandler,
            tid: dialog.tid,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };
}
