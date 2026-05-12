import dayjs from 'dayjs';

import { fagomradeLabels } from '@/form-schemas/nyDialogmeldingSkjema';
import {
    ApiBehandler,
    ApiBehandlerKategori,
    ApiDialogDetails,
    ApiDialogOppsummering,
    ApiDialogmelding,
    ApiNyDialogmelding,
    ApiSvarPaDialog,
} from '@io/rest/generated/sporhund.schemas';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

interface InternalDialog {
    id: string;
    behandler: ApiBehandler;
    tittel: string;
    tid: string;
    dialogmeldinger: ApiDialogmelding[];
}

const mockBehandler1: ApiBehandler = {
    id: 'behandlerId-1',
    kategori: ApiBehandlerKategori.LEGE,
    navn: { fornavn: 'Linus', etternavn: 'Lege', mellomnavn: null },
    legekontor: { kontor: 'Legesenteret', orgnummer: null, adresse: null },
};

const mockBehandler2: ApiBehandler = {
    id: 'behandlerId-2',
    kategori: ApiBehandlerKategori.LEGE,
    navn: { fornavn: 'Solveig', etternavn: 'Lege', mellomnavn: null },
    legekontor: { kontor: 'Legesenteret', orgnummer: null, adresse: null },
};

const mockBehandler3: ApiBehandler = {
    id: 'behandlerId-3',
    kategori: ApiBehandlerKategori.LEGE,
    navn: { fornavn: 'Christian', etternavn: 'Lege', mellomnavn: null },
    legekontor: { kontor: 'Legesenteret', orgnummer: null, adresse: null },
};

const initialDialoger: InternalDialog[] = [
    {
        id: 'dialogId-1',
        behandler: mockBehandler1,
        tittel: 'Forespørsel om dokumentasjon',
        tid: '2026-04-24T14:36:00',
        dialogmeldinger: [
            {
                tittel: 'Forespørsel om dokumentasjon',
                melding:
                    'Takk for tilsendt dokumentasjon. Vi trenger noen tilleggsopplysninger om pasientens funksjonsnivå og eventuelle tilretteleggingsmuligheter på arbeidsplassen. Kan dere gi en nærmere vurdering av dette?',
                tid: '2026-04-24T14:36:00',
                fraNav: true,
                vedlegg: [],
            },
            {
                tittel: 'Svar på forespørsel',
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
                tittel: 'Ytterligere dokumentasjon',
                melding:
                    'Hei, vi behandler saken til Mia Cathrine Svendsen og trenger ytterligere dokumentasjon for å kunne fatte et vedtak. Kan dere sende over relevant dokumentasjon som belyser pasientens tilstand og arbeidsevne?',
                tid: '2026-04-20T09:15:00',
                fraNav: true,
                vedlegg: [],
            },
        ],
    },
    {
        id: 'dialogId-2',
        behandler: mockBehandler1,
        tittel: 'Oppfølging etter sykmelding',
        tid: '2026-04-20T08:30:00',
        dialogmeldinger: [
            {
                tittel: 'Oppfølging etter sykmelding',
                melding: 'Vi ønsker en oppdatering på pasientens tilstand og forventet varighet på sykmeldingen.',
                tid: '2026-04-20T08:30:00',
                fraNav: true,
                vedlegg: [],
            },
        ],
    },
    {
        id: 'dialogId-3',
        behandler: mockBehandler2,
        tittel: 'Forespørsel om dokumentasjon',
        tid: '2026-04-24T14:36:00',
        dialogmeldinger: [
            {
                tittel: 'Forespørsel om dokumentasjon',
                melding: 'Vi ber om dokumentasjon knyttet til pasientens diagnose og behandlingsplan.',
                tid: '2026-04-24T14:36:00',
                fraNav: true,
                vedlegg: [],
            },
            {
                tittel: 'Svar med vedlegg',
                melding: 'Vedlagt sender jeg etterspurt dokumentasjon.',
                tid: '2026-04-23T10:49:00',
                fraNav: false,
                vedlegg: [{ navn: 'Dokumentasjon.pdf', url: '#' }],
            },
        ],
    },
    {
        id: 'dialogId-4',
        behandler: mockBehandler3,
        tittel: 'Sykmeldingsopplysninger',
        tid: '2026-04-10T09:00:00',
        dialogmeldinger: [
            {
                tittel: 'Sykmeldingsopplysninger',
                melding: 'Vi ønsker mer informasjon om diagnosen og prognosen for tilbakekomst til arbeid.',
                tid: '2026-04-10T09:00:00',
                fraNav: true,
                vedlegg: [],
            },
            {
                tittel: 'Svar',
                melding:
                    'Pasienten er sykmeldt grunnet rygglidelse. Prognosen er god, forventet tilbakekomst om 6–8 uker.',
                tid: '2026-04-08T13:15:00',
                fraNav: false,
                vedlegg: [{ navn: 'Sykmelding.pdf', url: '#' }],
            },
        ],
    },
    {
        id: 'dialogId-5',
        behandler: mockBehandler3,
        tittel: 'Vurdering av arbeidsevne',
        tid: '2026-04-05T11:00:00',
        dialogmeldinger: [
            {
                tittel: 'Vurdering av arbeidsevne',
                melding:
                    'Kan dere gi en vurdering av pasientens nåværende arbeidsevne og muligheter for gradert sykmelding?',
                tid: '2026-04-05T11:00:00',
                fraNav: true,
                vedlegg: [],
            },
            {
                tittel: 'Svar på vurdering',
                melding:
                    'Pasienten kan på det nåværende tidspunkt ikke benytte seg av gradert sykmelding, men vi vil revurdere dette om 2 uker.',
                tid: '2026-04-04T10:00:00',
                fraNav: false,
                vedlegg: [{ navn: 'Vurdering.pdf', url: '#' }],
            },
        ],
    },
    {
        id: 'dialogId-6',
        behandler: mockBehandler3,
        tittel: 'Bekreftelse på behandlingsplan',
        tid: '2026-03-28T14:00:00',
        dialogmeldinger: [
            {
                tittel: 'Bekreftelse på behandlingsplan',
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
        return DialogmeldingMock.dialoger.map((dialog) => ({
            id: dialog.id,
            behandler: dialog.behandler,
            tittel: dialog.tittel,
            tid: dialog.tid,
            antallMeldinger: dialog.dialogmeldinger.length,
            antallVedlegg: dialog.dialogmeldinger.reduce((sum, m) => sum + m.vedlegg.length, 0),
        }));
    };

    static getById = (dialogId: string): ApiDialogDetails | null => {
        const dialog = DialogmeldingMock.dialoger.find((d) => d.id === dialogId);
        if (!dialog) return null;
        return {
            id: dialog.id,
            behandler: dialog.behandler,
            tittel: dialog.tittel,
            tid: dialog.tid,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };

    static addDialogmelding = (data: ApiNyDialogmelding): ApiDialogDetails => {
        const tid = dayjs().format(ISO_TIDSPUNKTFORMAT);
        const tittel = fagomradeLabels[data.fagomrade];
        const id = crypto.randomUUID();

        const dialog: InternalDialog = {
            id,
            behandler: data.behandler,
            tittel,
            tid,
            dialogmeldinger: [
                {
                    tittel,
                    melding: data.melding,
                    tid,
                    fraNav: true,
                    vedlegg: [],
                },
            ],
        };

        DialogmeldingMock.dialoger.unshift(dialog);

        return {
            id: dialog.id,
            behandler: dialog.behandler,
            tittel: dialog.tittel,
            tid: dialog.tid,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };

    static addSvar = (dialogId: string, data: ApiSvarPaDialog): ApiDialogDetails | null => {
        const dialog = DialogmeldingMock.dialoger.find((d) => d.id === dialogId);
        if (!dialog) return null;

        const tid = dayjs().format(ISO_TIDSPUNKTFORMAT);
        dialog.dialogmeldinger.unshift({
            tittel: 'Svar fra Nav',
            melding: data.melding,
            tid,
            fraNav: true,
            vedlegg: [],
        });
        dialog.tid = tid;

        return {
            id: dialog.id,
            behandler: dialog.behandler,
            tittel: dialog.tittel,
            tid: dialog.tid,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };
}
