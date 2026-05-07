import dayjs from 'dayjs';

import {
    ApiBehandlerMedDialoger,
    ApiDialogDetails,
    ApiDialogmelding,
    ApiNyDialogmelding,
} from '@io/rest/generated/sporhund.schemas';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

interface InternalDialog {
    id: string;
    behandlerId: string;
    behandlernavn: string;
    tittel: string;
    tid: string;
    dialogmeldinger: ApiDialogmelding[];
}

const initialDialoger: InternalDialog[] = [
    {
        id: 'dialogId-1',
        behandlerId: 'behandlerId-1',
        behandlernavn: 'Linus Lege',
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
        behandlerId: 'behandlerId-1',
        behandlernavn: 'Linus Lege',
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
        behandlerId: 'behandlerId-2',
        behandlernavn: 'Solveig Lege',
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
        behandlerId: 'behandlerId-3',
        behandlernavn: 'Christian Lege',
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
        behandlerId: 'behandlerId-3',
        behandlernavn: 'Christian Lege',
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
        behandlerId: 'behandlerId-3',
        behandlernavn: 'Christian Lege',
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

    static getAll = (): ApiBehandlerMedDialoger[] => {
        const grouped = new Map<string, ApiBehandlerMedDialoger>();

        for (const dialog of DialogmeldingMock.dialoger) {
            let behandler = grouped.get(dialog.behandlerId);
            if (!behandler) {
                behandler = {
                    behandlerId: dialog.behandlerId,
                    behandlernavn: dialog.behandlernavn,
                    dialoger: [],
                };
                grouped.set(dialog.behandlerId, behandler);
            }
            behandler.dialoger.push({
                id: dialog.id,
                tittel: dialog.tittel,
                tid: dialog.tid,
                antallMeldinger: dialog.dialogmeldinger.length,
                antallVedlegg: dialog.dialogmeldinger.reduce((sum, m) => sum + m.vedlegg.length, 0),
            });
        }

        return [...grouped.values()];
    };

    static getById = (dialogId: string): ApiDialogDetails | null => {
        const dialog = DialogmeldingMock.dialoger.find((d) => d.id === dialogId);
        if (!dialog) return null;
        return {
            id: dialog.id,
            behandlerId: dialog.behandlerId,
            behandlernavn: dialog.behandlernavn,
            tittel: dialog.tittel,
            tid: dialog.tid,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };

    static addDialogmelding = (data: ApiNyDialogmelding): ApiDialogDetails => {
        const tid = dayjs().format(ISO_TIDSPUNKTFORMAT);
        const tittel = data.type === 'L8' ? 'Tilleggsopplysninger (L8)' : 'Legeerklæring (L40)';
        const id = crypto.randomUUID();

        const dialog: InternalDialog = {
            id,
            behandlerId: data.behandlerId,
            behandlernavn: data.behandlernavn,
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
            behandlerId: dialog.behandlerId,
            behandlernavn: dialog.behandlernavn,
            tittel: dialog.tittel,
            tid: dialog.tid,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };
}
