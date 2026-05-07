import { ApiBehandlerDialog } from '@io/rest/generated/sporhund.schemas';

export const testBehandlere: ApiBehandlerDialog[] = [
    {
        behandlernavn: 'Linus Lege',
        behandlerId: 'behandlerId-1',
        dialoger: [
            {
                id: 'dialogId-1',
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
                tittel: 'Oppfølging etter sykmelding',
                tid: '2026-04-20T08:30:00',
                dialogmeldinger: [
                    {
                        tittel: 'Oppfølging etter sykmelding',
                        melding:
                            'Vi ønsker en oppdatering på pasientens tilstand og forventet varighet på sykmeldingen.',
                        tid: '2026-04-20T08:30:00',
                        fraNav: true,
                        vedlegg: [],
                    },
                ],
            },
        ],
    },
    {
        behandlernavn: 'Solveig Lege',
        behandlerId: 'behandlerId-2',
        dialoger: [
            {
                id: 'dialogId-3',
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
        ],
    },
    {
        behandlernavn: 'Christian Lege',
        behandlerId: 'behandlerId-3',
        dialoger: [
            {
                id: 'dialogId-4',
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
        ],
    },
];

export function finnDialog(behandlere: ApiBehandlerDialog[], dialogId: string) {
    for (const behandler of behandlere) {
        const dialog = behandler.dialoger.find((d) => d.id === dialogId);
        if (dialog) return dialog;
    }
    return null;
}

export function finnNyesteDialog(behandlere: ApiBehandlerDialog[]) {
    return behandlere.flatMap((b) => b.dialoger).sort((a, b) => b.tid.localeCompare(a.tid))[0] ?? null;
}
