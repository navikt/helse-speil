import dayjs from 'dayjs';

import {
    ApiBehandler,
    ApiBehandlerKategori,
    ApiDialogDetails,
    ApiDialogOppsummering,
    ApiDialogmelding,
    ApiDialogmeldingFraBehandler,
    ApiDialogmeldingFraSystem,
    ApiDialogmeldingOppgave,
    ApiDialogmeldingStatus,
    ApiFagomrade,
    ApiNyDialogmelding,
    ApiOppdaterDialogStatus,
    ApiSoker,
    ApiSvarPaDialog,
} from '@io/rest/generated/sporhund.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';
import { erFraBehandler } from '@utils/typeguards';

interface InternalDialog {
    conversationRef: string;
    aktorId: string;
    behandler: ApiBehandler;
    opprettetTidspunkt: string;
    status: ApiDialogmeldingStatus;
    soker: ApiSoker;
    dialogmeldinger: ApiDialogmelding[];
}

const mockBehandler1: ApiBehandler = {
    id: 'behandlerId-1',
    hprNummer: 1234567,
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
    hprNummer: 1234568,
    kategori: ApiBehandlerKategori.LEGE,
    navn: { fornavn: 'Solveig', etternavn: 'Bakke', mellomnavn: null },
    legekontor: { kontor: 'Legesenteret', orgnummer: null, adresse: null, postnummer: null, poststed: null },
};

const mockBehandler3: ApiBehandler = {
    id: 'behandlerId-3',
    hprNummer: 1234569,
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
        aktorId: '2564094783926',
        behandler: mockBehandler1,
        opprettetTidspunkt: '2026-04-24T14:36:00',
        status: ApiDialogmeldingStatus.SENDT,
        soker: { fodselsdato: '1988-05-14', navn: { fornavn: 'Slapp', etternavn: 'Appelsin', mellomnavn: null } },
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                melding:
                    'Takk for tilsendt dokumentasjon. Vi trenger noen tilleggsopplysninger om pasientens funksjonsnivå og eventuelle tilretteleggingsmuligheter på arbeidsplassen. Kan dere gi en nærmere vurdering av dette?',
                sendtTidspunkt: '2026-04-24T14:36:00',
                saksbehandler: 'Mock Saksbehandler',
                msgId: 'a1b2c3d4-0001-0001-0001-000000000001',
            },
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                melding:
                    'Hei, vedlagt finner dere den forespurte dokumentasjonen. Jeg har lagt ved relevant journaldokumentasjon og vurdering av pasientens tilstand. Ta gjerne kontakt dersom dere trenger ytterligere opplysninger.',
                sendtTidspunkt: '2026-04-22T07:21:00',
                msgId: 'a1b2c3d4-0002-0002-0002-000000000002',
                antallVedlegg: 3,
            },
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                melding:
                    'Hei, vi behandler saken til Mia Cathrine Svendsen og trenger ytterligere dokumentasjon for å kunne fatte et vedtak. Kan dere sende over relevant dokumentasjon som belyser pasientens tilstand og arbeidsevne?',
                sendtTidspunkt: '2026-04-20T09:15:00',
                saksbehandler: 'Mock Saksbehandler',
                msgId: 'a1b2c3d4-0003-0003-0003-000000000003',
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440002',
        aktorId: '1000001337420',
        behandler: mockBehandler1,
        opprettetTidspunkt: '2026-04-27T08:30:00',
        status: ApiDialogmeldingStatus.PURRING_SENDT,
        soker: {
            fodselsdato: '1992-03-22',
            navn: { fornavn: 'Optimistisk', etternavn: 'Banan', mellomnavn: null },
        },
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.ENKELTSTAENDE_BEHANDLINGSDAGER,
                melding: 'Vi ønsker en oppdatering på pasientens tilstand og forventet varighet på sykmeldingen.',
                sendtTidspunkt: '2026-04-27T08:30:00',
                saksbehandler: 'Mock Saksbehandler',
                msgId: 'a1b2c3d4-0004-0004-0004-000000000004',
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440003',
        aktorId: '2117136462117',
        behandler: mockBehandler2,
        opprettetTidspunkt: '2026-04-24T14:36:00',
        status: ApiDialogmeldingStatus.MOTTATT,
        soker: { fodselsdato: '1979-11-08', navn: { fornavn: 'Sindig', etternavn: 'Globus', mellomnavn: null } },
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.BESTRIDELSE,
                melding: 'Vedlagt sender jeg etterspurt dokumentasjon.',
                sendtTidspunkt: '2026-04-24T14:36:00',
                msgId: 'a1b2c3d4-0005-0005-0005-000000000005',
                antallVedlegg: 1,
            },
            {
                fagomrade: ApiFagomrade.BESTRIDELSE,
                melding: 'Vi ber om dokumentasjon knyttet til pasientens diagnose og behandlingsplan.',
                sendtTidspunkt: '2026-04-23T10:49:00',
                saksbehandler: 'A123456',
                msgId: 'a1b2c3d4-0006-0006-0006-000000000006',
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440004',
        aktorId: '2805594640665',
        behandler: mockBehandler3,
        opprettetTidspunkt: '2026-04-10T09:00:00',
        status: ApiDialogmeldingStatus.MOTTATT,
        soker: { fodselsdato: '1985-07-30', navn: { fornavn: 'Punktlig', etternavn: 'Jakke', mellomnavn: null } },
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.YRKESSKADE,
                melding:
                    'Pasienten er sykmeldt grunnet rygglidelse. Prognosen er god, forventet tilbakekomst om 6–8 uker.',
                sendtTidspunkt: '2026-04-10T09:00:00',
                msgId: 'a1b2c3d4-0007-0007-0007-000000000007',
                antallVedlegg: 1,
            },
            {
                fagomrade: ApiFagomrade.YRKESSKADE,
                melding: 'Vi ønsker mer informasjon om diagnosen og prognosen for tilbakekomst til arbeid.',
                sendtTidspunkt: '2026-04-08T13:15:00',
                saksbehandler: 'A123456',
                msgId: 'a1b2c3d4-0008-0008-0008-000000000008',
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440005',
        aktorId: '2407074650987',
        behandler: mockBehandler3,
        opprettetTidspunkt: '2026-04-05T11:00:00',
        status: ApiDialogmeldingStatus.AVVIST,
        soker: {
            fodselsdato: '1995-01-17',
            navn: { fornavn: 'Minimalistisk', etternavn: 'Aroma', mellomnavn: null },
        },
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                melding: 'Melding som ble avvist',
                sendtTidspunkt: '2026-04-06T12:12:12',
                saksbehandler: 'A123456',
                msgId: 'a1b2c3d4-0010-0010-0010-000000000110',
            },
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                melding:
                    'Pasienten kan på det nåværende tidspunkt ikke benytte seg av gradert sykmelding, men vi vil revurdere dette om 2 uker.',
                sendtTidspunkt: '2026-04-05T11:00:00',
                msgId: 'a1b2c3d4-0009-0009-0009-000000000009',
                antallVedlegg: 1,
            },
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                melding:
                    'Kan dere gi en vurdering av pasientens nåværende arbeidsevne og muligheter for gradert sykmelding?',
                sendtTidspunkt: '2026-04-04T10:00:00',
                saksbehandler: 'A123456',
                msgId: 'a1b2c3d4-0010-0010-0010-000000000010',
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440006',
        aktorId: '2564094783926',
        behandler: mockBehandler3,
        opprettetTidspunkt: '2026-03-28T14:00:00',
        status: ApiDialogmeldingStatus.SENDT,
        soker: { fodselsdato: '1988-05-14', navn: { fornavn: 'Slapp', etternavn: 'Appelsin', mellomnavn: null } },
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.ENKELTSTAENDE_BEHANDLINGSDAGER,
                melding: 'Vi ber om bekreftelse på at behandlingsplanen er iverksatt.',
                sendtTidspunkt: '2026-03-28T14:00:00',
                saksbehandler: 'A123456',
                msgId: 'a1b2c3d4-0011-0011-0011-000000000011',
            },
        ],
    },
    {
        conversationRef: '550e8400-e29b-41d4-a716-446655440007',
        aktorId: '2805594640665',
        behandler: mockBehandler2,
        opprettetTidspunkt: '2026-05-10T09:00:00',
        status: ApiDialogmeldingStatus.MOTTATT,
        soker: { fodselsdato: '1985-07-30', navn: { fornavn: 'Punktlig', etternavn: 'Jakke', mellomnavn: null } },
        dialogmeldinger: [
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                melding:
                    'Beklager sen tilbakemelding. Vedlagt finner dere den etterspurte dokumentasjonen på pasientens tilstand.',
                sendtTidspunkt: '2026-05-23T08:45:00',
                msgId: 'a1b2c3d4-0014-0014-0014-000000000014',
                antallVedlegg: 1,
            },
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                melding:
                    'Vi minner om vår forespørsel fra 10. mai. Vi har fortsatt ikke mottatt den etterspurte dokumentasjonen og ber om svar innen 5 virkedager.',
                sendtTidspunkt: '2026-05-22T10:15:00',
                msgId: 'a1b2c3d4-0012-0012-0012-000000000012',
            } satisfies ApiDialogmeldingFraSystem,
            {
                fagomrade: ApiFagomrade.TILBAKEDATERING,
                melding:
                    'Vi trenger dokumentasjon på pasientens tilstand for å vurdere tilbakedatering av sykmeldingen. Kan dere sende over relevante opplysninger?',
                sendtTidspunkt: '2026-05-1T09:00:00',
                saksbehandler: 'A123456',
                msgId: 'a1b2c3d4-0013-0013-0013-000000000013',
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
                const sisteAktivitetTidspunkt = getSisteAktivitetTidspunkt(dialog);
                return {
                    conversationRef: dialog.conversationRef,
                    behandler: dialog.behandler,
                    fagomrade: first.fagomrade,
                    sisteAktivitetTidspunkt,
                    antallMeldinger: dialog.dialogmeldinger.length,
                    antallVedlegg: dialog.dialogmeldinger.reduce(
                        (sum, m) => sum + (erFraBehandler(m) ? m.antallVedlegg : 0),
                        0,
                    ),
                    status: dialog.status,
                };
            });
    };

    static getByIdForPerson = (personPseudoId: string, dialogId: string): ApiDialogDetails | null => {
        const dialog = DialogmeldingMock.getDialogForPerson(personPseudoId, dialogId);
        if (!dialog) return null;
        return {
            conversationRef: dialog.conversationRef,
            behandler: dialog.behandler,
            status: dialog.status,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };

    static getAllForOppgaver = (): ApiDialogmeldingOppgave[] => {
        return DialogmeldingMock.dialoger
            .filter((dialog) => dialog.status !== ApiDialogmeldingStatus.FERDIGSTILT)
            .map((dialog) => {
                const personPseudoId = DialogmeldingMock.tilPersonPseudoId(dialog) ?? 'unknown';
                const first = dialog.dialogmeldinger[0]!;
                const sisteAktivitetTidspunkt = getSisteAktivitetTidspunkt(dialog);
                return {
                    conversationRef: dialog.conversationRef,
                    fagomrade: first.fagomrade,
                    status: dialog.status,
                    sisteAktivitetTidspunkt,
                    fristTidspunkt: getFrist(sisteAktivitetTidspunkt),
                    personPseudoId,
                    soker: dialog.soker,
                };
            });
    };

    static addDialogmelding = (personPseudoId: string, data: ApiNyDialogmelding): ApiDialogDetails => {
        const tid = dayjs().format(ISO_TIDSPUNKTFORMAT);
        const conversationRef = crypto.randomUUID();
        const aktorId = PersonMock.findAktørIdForPersonPseudoId(personPseudoId) ?? '2564094783926';

        const dialog: InternalDialog = {
            conversationRef,
            aktorId,
            behandler: data.behandler,
            opprettetTidspunkt: tid,
            status: ApiDialogmeldingStatus.SENDT,
            soker: data.soker,
            dialogmeldinger: [
                {
                    fagomrade: data.fagomrade,
                    melding: data.melding,
                    sendtTidspunkt: tid,
                    saksbehandler: 'A123456',
                    msgId: crypto.randomUUID(),
                },
            ],
        };

        DialogmeldingMock.dialoger.unshift(dialog);

        return {
            conversationRef: dialog.conversationRef,
            behandler: dialog.behandler,
            status: dialog.status,
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
            melding: data.melding,
            sendtTidspunkt: tid,
            saksbehandler: 'A123456',
            msgId: crypto.randomUUID(),
        });
        dialog.status = ApiDialogmeldingStatus.SENDT;

        return {
            conversationRef: dialog.conversationRef,
            behandler: dialog.behandler,
            status: dialog.status,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };

    static addBehandlerSvarForPerson = (personPseudoId: string, dialogId: string): ApiDialogDetails | null => {
        const dialog = DialogmeldingMock.getDialogForPerson(personPseudoId, dialogId);
        if (!dialog) return null;

        const tid = dayjs().format(ISO_TIDSPUNKTFORMAT);
        const first = dialog.dialogmeldinger[0]!;
        dialog.dialogmeldinger.unshift({
            fagomrade: first.fagomrade,
            melding:
                'Vedlagt finner dere etterspurt dokumentasjon. Pasienten har vært til kontroll og jeg har oppdatert vurderingen. Ta kontakt dersom dere trenger ytterligere opplysninger.',
            sendtTidspunkt: tid,
            msgId: crypto.randomUUID(),
            antallVedlegg: 1,
        } satisfies ApiDialogmeldingFraBehandler);
        dialog.status = ApiDialogmeldingStatus.MOTTATT;

        return {
            conversationRef: dialog.conversationRef,
            behandler: dialog.behandler,
            status: dialog.status,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };

    static updateStatus = (
        personPseudoId: string,
        dialogId: string,
        data: ApiOppdaterDialogStatus,
    ): ApiDialogDetails | null => {
        const dialog = DialogmeldingMock.getDialogForPerson(personPseudoId, dialogId);
        if (!dialog) return null;

        if (data.ferdigstilt) {
            dialog.status = ApiDialogmeldingStatus.FERDIGSTILT;
        } else {
            const nyesteMelding = dialog.dialogmeldinger[0];
            dialog.status =
                nyesteMelding && erFraBehandler(nyesteMelding)
                    ? ApiDialogmeldingStatus.MOTTATT
                    : ApiDialogmeldingStatus.SENDT;
        }

        return {
            conversationRef: dialog.conversationRef,
            behandler: dialog.behandler,
            status: dialog.status,
            dialogmeldinger: dialog.dialogmeldinger,
        };
    };
}

function getFrist(dato: string): string {
    const d = new Date(dato);
    d.setDate(d.getDate() + 21);
    return d.toISOString();
}

function getSisteAktivitetTidspunkt(dialog: InternalDialog): string {
    return dialog.dialogmeldinger.reduce(
        (newest, m) => (m.sendtTidspunkt > newest ? m.sendtTidspunkt : newest),
        dialog.dialogmeldinger[0]!.sendtTidspunkt,
    );
}
