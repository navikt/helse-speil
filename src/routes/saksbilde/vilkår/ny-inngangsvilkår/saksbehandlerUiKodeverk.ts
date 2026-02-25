import { SaksbehandlerUiKodeverk } from '@saksbilde/vilkår/ny-inngangsvilkår/kodeverkTyper';

export const saksbehandlerUiKodeverk: SaksbehandlerUiKodeverk[] = [
    {
        vilkårskode: 'MEDLEM_I_FOLKETRYGDEN',
        beskrivelse: 'Medlemskap i folketrygden',
        kategori: 'generelle_bestemmelser',
        paragrafTag: 'Kapittel 2',
        underspørsmål: [
            {
                kode: '86f6875b-0e0b-41a8-856f-0454b9f7c693',
                navn: 'Er den sykmeldte medlem i folketrygden?',
                variant: 'RADIO',
                alternativer: [
                    {
                        kode: 'MEDLEMSKAP_JA',
                        navn: 'Ja',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                    {
                        kode: 'MEDLEMSKAP_NEI',
                        navn: 'Nei',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                ],
            },
        ],
    },
    {
        vilkårskode: 'OPPTJENING',
        beskrivelse: 'Opptjeningstid',
        kategori: 'generelle_bestemmelser',
        paragrafTag: '§ 8-2',
        underspørsmål: [
            {
                kode: '81618640-755e-4c23-92c0-0806d05faa5b',
                navn: 'Oppfyller vilkår om opptjeningstid',
                variant: 'RADIO',
                alternativer: [
                    {
                        kode: 'OPPTJENING_MINST_4_UKER',
                        navn: 'Ja, minst fire uker i arbeid umiddelbart før arbeidsuførhet',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                    {
                        kode: 'ab6e09a4-e770-4a0d-a63c-872f640b8b1a',
                        navn: 'Ja, andre årsaker',
                        harUnderspørsmål: true,
                        underspørsmål: [
                            {
                                kode: 'ffe3cf76-3184-4b29-a898-74bf57e529e8',
                                variant: 'RADIO',
                                alternativer: [
                                    {
                                        kode: 'OPPTJENING_ANNEN_YTELSE',
                                        navn: 'Mottak av ytelse som er likestilt med arbeid',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'OPPTJENING_YRKESAKTIV_FOER_FORELDREPENGER',
                                        navn: 'Forutgående foreldrepenger opptjent på grunnlag av arbeidsavklaringspenger, men personen har vært sammenhengende yrkesaktiv (eller mottatt ytelse etter kapittel 8, 9 eller 14) i minst fire uker umiddelbart før uttaket av foreldrepenger startet',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'OPPTJENING_COVID',
                                        navn: 'Mottak av covid-ytelse',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        kode: 'f227f4f9-bfd4-41be-b314-17cefb4f8d0d',
                        navn: 'Nei',
                        harUnderspørsmål: true,
                        underspørsmål: [
                            {
                                kode: '1a6009f6-d47a-4698-b846-c5c218e39585',
                                variant: 'RADIO',
                                alternativer: [
                                    {
                                        kode: 'IKKE_OPPTJENING_ARBEID_ELLER_YTELSE',
                                        navn: 'Ikke arbeid eller likestilt ytelse umiddelbart før arbeidsuførhet',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'OPPTJENING_AAP_FOR_FORELDREPENGER',
                                        navn: 'Forutgående foreldrepenger opptjent på grunnlag av arbeidsavklaringspenger, og personen har ikke vært sammenhengende yrkesaktiv (eller mottatt ytelse etter kapittel 8, 9 eller 14) i minst fire uker umiddelbart før uttaket av foreldrepenger startet',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
