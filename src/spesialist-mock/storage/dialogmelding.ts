import dayjs from 'dayjs';

import {
    ApiBehandler,
    ApiBehandlerKategori,
    ApiDialogDetails,
    ApiDialogOppsummering,
    ApiDialogmelding,
    ApiDialogmeldingOppgave,
    ApiDialogmeldingStatus,
    ApiDialogmeldingType,
    ApiFagomrade,
    ApiNavn,
    ApiNyDialogmelding,
    ApiSvarPaDialog,
} from '@io/rest/generated/sporhund.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

const sokerNavn: ApiNavn[] = [
    { fornavn: 'Slapp', mellomnavn: null, etternavn: 'Appelsin' },
    { fornavn: 'Optimistisk', mellomnavn: null, etternavn: 'Banan' },
    { fornavn: 'Skeptisk', mellomnavn: null, etternavn: 'Service' },
    { fornavn: 'Punktlig', mellomnavn: null, etternavn: 'Jakke' },
    { fornavn: 'Minimalistisk', mellomnavn: null, etternavn: 'Aroma' },
];

// aktorId for SLAPP APPELSIN from mock oppgaver
const MOCK_AKTOR_ID = '2564094783926';

interface InternalDialog {
    conversationRef: string;
    aktorId: string;
    behandler: ApiBehandler;
    opprettetTidspunkt: string;
    status: ApiDialogmeldingStatus;
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
        aktorId: MOCK_AKTOR_ID,
        behandler: mockBehandler1,
        opprettetTidspunkt: '2026-04-24T14:36:00',
        status: ApiDialogmeldingStatus.SENDT,
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding:
                    'Takk for tilsendt dokumentasjon. Vi trenger noen tilleggsopplysninger om pasientens funksjonsnivå og eventuelle tilretteleggingsmuligheter på arbeidsplassen. Kan dere gi en nærmere vurdering av dette?',
                sendtTidspunkt: '2026-04-24T14:36:00',
                fraNav: true,
                vedlegg: [],
            },
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding:
                    'Hei, vedlagt finner dere den forespurte dokumentasjonen. Jeg har lagt ved relevant journaldokumentasjon og vurdering av pasientens tilstand. Ta gjerne kontakt dersom dere trenger ytterligere opplysninger.',
                sendtTidspunkt: '2026-04-22T07:21:00',
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
                sendtTidspunkt: '2026-04-20T09:15:00',
                fraNav: true,
                vedlegg: [],
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440002',
        aktorId: MOCK_AKTOR_ID,
        behandler: mockBehandler1,
        opprettetTidspunkt: '2026-04-20T08:30:00',
        status: ApiDialogmeldingStatus.PURRING_SENDT,
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.ENKELTSTAENDE_BEHANDLINGSDAGER,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding: 'Vi ønsker en oppdatering på pasientens tilstand og forventet varighet på sykmeldingen.',
                sendtTidspunkt: '2026-04-20T08:30:00',
                fraNav: true,
                vedlegg: [],
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440003',
        aktorId: MOCK_AKTOR_ID,
        behandler: mockBehandler2,
        opprettetTidspunkt: '2026-04-24T14:36:00',
        status: ApiDialogmeldingStatus.MOTTATT,
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.BESTRIDELSE,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding: 'Vi ber om dokumentasjon knyttet til pasientens diagnose og behandlingsplan.',
                sendtTidspunkt: '2026-04-24T14:36:00',
                fraNav: true,
                vedlegg: [],
            },
            {
                fagomrade: ApiFagomrade.BESTRIDELSE,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding: 'Vedlagt sender jeg etterspurt dokumentasjon.',
                sendtTidspunkt: '2026-04-23T10:49:00',
                fraNav: false,
                vedlegg: [{ navn: 'Dokumentasjon.pdf', url: '#' }],
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440004',
        aktorId: MOCK_AKTOR_ID,
        behandler: mockBehandler3,
        opprettetTidspunkt: '2026-04-10T09:00:00',
        status: ApiDialogmeldingStatus.FERDIGSTILT,
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.YRKESSKADE,
                meldingstype: ApiDialogmeldingType.SPESIALISTERKLAERING,
                melding: 'Vi ønsker mer informasjon om diagnosen og prognosen for tilbakekomst til arbeid.',
                sendtTidspunkt: '2026-04-10T09:00:00',
                fraNav: true,
                vedlegg: [],
            },
            {
                fagomrade: ApiFagomrade.YRKESSKADE,
                meldingstype: ApiDialogmeldingType.SPESIALISTERKLAERING,
                melding:
                    'Pasienten er sykmeldt grunnet rygglidelse. Prognosen er god, forventet tilbakekomst om 6–8 uker.',
                sendtTidspunkt: '2026-04-08T13:15:00',
                fraNav: false,
                vedlegg: [{ navn: 'Sykmelding.pdf', url: '#' }],
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440005',
        aktorId: MOCK_AKTOR_ID,
        behandler: mockBehandler3,
        opprettetTidspunkt: '2026-04-05T11:00:00',
        status: ApiDialogmeldingStatus.SENDT,
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding:
                    'Kan dere gi en vurdering av pasientens nåværende arbeidsevne og muligheter for gradert sykmelding?',
                sendtTidspunkt: '2026-04-05T11:00:00',
                fraNav: true,
                vedlegg: [],
            },
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                meldingstype: ApiDialogmeldingType.MEDISINSKE_OPPLYSNINGER,
                melding:
                    'Pasienten kan på det nåværende tidspunkt ikke benytte seg av gradert sykmelding, men vi vil revurdere dette om 2 uker.',
                sendtTidspunkt: '2026-04-04T10:00:00',
                fraNav: false,
                vedlegg: [{ navn: 'Vurdering.pdf', url: '#' }],
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440006',
        aktorId: MOCK_AKTOR_ID,
        behandler: mockBehandler3,
        opprettetTidspunkt: '2026-03-28T14:00:00',
        status: ApiDialogmeldingStatus.PURRING_SENDT,
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.ENKELTSTAENDE_BEHANDLINGSDAGER,
                meldingstype: ApiDialogmeldingType.SPESIALISTERKLAERING,
                melding: 'Vi ber om bekreftelse på at behandlingsplanen er iverksatt.',
                sendtTidspunkt: '2026-03-28T14:00:00',
                fraNav: true,
                vedlegg: [],
            },
        ],
    },
];

export class DialogmeldingMock {
    private static dialoger: InternalDialog[] = structuredClone(initialDialoger);

    private static tilPersonPseudoId = (dialog: InternalDialog): string | null => {
        return PersonMock.findPersonPseudoId(dialog.aktorId);
    };

    private static getDialogForPerson = (personPseudoId: string, dialogId: string): InternalDialog | null => {
        return (
            DialogmeldingMock.dialoger.find(
                (dialog) =>
                    dialog.conversationRef === dialogId &&
                    DialogmeldingMock.tilPersonPseudoId(dialog) === personPseudoId,
            ) ?? null
        );
    };

    static getAllForPerson = (personPseudoId: string): ApiDialogOppsummering[] => {
        return DialogmeldingMock.dialoger
            .filter((dialog) => DialogmeldingMock.tilPersonPseudoId(dialog) === personPseudoId)
            .map((dialog) => {
                const first = dialog.dialogmeldinger[0]!;
                return {
                    conversationRef: dialog.conversationRef,
                    behandler: dialog.behandler,
                    fagomrade: first.fagomrade,
                    meldingstype: first.meldingstype,
                    opprettetTidspunkt: dialog.opprettetTidspunkt,
                    antallMeldinger: dialog.dialogmeldinger.length,
                    antallVedlegg: dialog.dialogmeldinger.reduce((sum, m) => sum + m.vedlegg.length, 0),
                };
            });
    };

    static getByIdForPerson = (personPseudoId: string, dialogId: string): ApiDialogDetails | null => {
        const dialog = DialogmeldingMock.getDialogForPerson(personPseudoId, dialogId);
        if (!dialog) return null;
        return {
            conversationRef: dialog.conversationRef,
            behandler: dialog.behandler,
            opprettetTidspunkt: dialog.opprettetTidspunkt,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };

    static getAllForOppgaver = (): ApiDialogmeldingOppgave[] => {
        return DialogmeldingMock.dialoger.map((dialog, index) => {
            const personPseudoId = DialogmeldingMock.tilPersonPseudoId(dialog) ?? 'unknown';
            const first = dialog.dialogmeldinger[0]!;
            const sisteAktivitetTidspunkt = dialog.opprettetTidspunkt;
            return {
                conversationRef: dialog.conversationRef,
                fagomrade: first.fagomrade,
                meldingstype: first.meldingstype,
                status: dialog.status,
                sisteAktivitetTidspunkt,
                fristTidspunkt: getFrist(sisteAktivitetTidspunkt),
                personPseudoId,
                soker: sokerNavn[index % sokerNavn.length]!,
            };
        });
    };

    static addDialogmelding = (personPseudoId: string, data: ApiNyDialogmelding): ApiDialogDetails => {
        const tid = dayjs().format(ISO_TIDSPUNKTFORMAT);
        const conversationRef = crypto.randomUUID();
        const aktorId = PersonMock.findAktørIdForPersonPseudoId(personPseudoId) ?? MOCK_AKTOR_ID;

        const dialog: InternalDialog = {
            conversationRef,
            aktorId,
            behandler: data.behandler,
            opprettetTidspunkt: tid,
            status: ApiDialogmeldingStatus.SENDT,
            dialogmeldinger: [
                {
                    fagomrade: data.fagomrade,
                    meldingstype: data.meldingstype,
                    melding: data.melding,
                    sendtTidspunkt: tid,
                    fraNav: true,
                    vedlegg: [],
                },
            ],
        };

        DialogmeldingMock.dialoger.unshift(dialog);

        return {
            conversationRef: dialog.conversationRef,
            behandler: dialog.behandler,
            opprettetTidspunkt: dialog.opprettetTidspunkt,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };

    static addSvarForPerson = (
        personPseudoId: string,
        dialogId: string,
        data: ApiSvarPaDialog,
    ): ApiDialogDetails | null => {
        const dialog = DialogmeldingMock.getDialogForPerson(personPseudoId, dialogId);
        if (!dialog) return null;

        const tid = dayjs().format(ISO_TIDSPUNKTFORMAT);
        const first = dialog.dialogmeldinger[0]!;
        dialog.dialogmeldinger.unshift({
            fagomrade: first.fagomrade,
            meldingstype: first.meldingstype,
            melding: data.melding,
            sendtTidspunkt: tid,
            fraNav: true,
            vedlegg: [],
        });
        dialog.opprettetTidspunkt = tid;
        dialog.status = ApiDialogmeldingStatus.SENDT;

        return {
            conversationRef: dialog.conversationRef,
            behandler: dialog.behandler,
            opprettetTidspunkt: dialog.opprettetTidspunkt,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };
}

function getFrist(dato: string): string {
    const d = new Date(dato);
    d.setDate(d.getDate() + 21);
    return d.toISOString();
}
