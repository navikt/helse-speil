import { Vilkårskode } from '@saksbilde/vilkår/ny-inngangsvilkår/kodeverkTyper';

export const vilkårskodeverk: Vilkårskode[] = [
    {
        vilkårshjemmel: {
            lovverk: 'Folketrygdloven',
            lovverksversjon: '2020-06-12',
            kapittel: '8',
            paragraf: '2',
            ledd: '',
            setning: null,
            bokstav: null,
        },
        beskrivelse: 'Opptjeningstid',
        oppfylt: [
            {
                kode: 'OPPTJENING_MINST_4_UKER',
                beskrivelse: 'Har arbeidet i minst fire uker før arbeidsuførhet inntreffer',
                vilkårshjemmel: {
                    lovverk: 'Folketrygdloven',
                    lovverksversjon: '2020-06-12',
                    kapittel: '8',
                    paragraf: '2',
                    ledd: '1',
                    setning: '1',
                },
            },
            {
                kode: 'OPPTJENING_ANNEN_YTELSE',
                beskrivelse:
                    'Har mottatt dagpenger, omsorgspenger, pleiepenger, opplæringspenger, svangerskapspenger eller foreldrepenger',
                vilkårshjemmel: {
                    lovverk: 'Folketrygdloven',
                    lovverksversjon: '2020-06-12',
                    kapittel: '8',
                    paragraf: '2',
                    ledd: '2',
                    setning: '1',
                },
            },
            {
                kode: 'OPPTJENING_YRKESAKTIV_FOER_FORELDREPENGER',
                beskrivelse:
                    'Sammenhengende yrkesaktiv (eller mottatt ytelse etter kapittel 8, 9 eller 14) i minst fire uker umiddelbart før uttaket av foreldrepenger starter',
                vilkårshjemmel: {
                    lovverk: 'Folketrygdloven',
                    lovverksversjon: '2020-06-12',
                    kapittel: '8',
                    paragraf: '2',
                    ledd: '2',
                    setning: '3',
                    bokstav: null,
                },
            },
        ],
        ikkeOppfylt: [
            {
                kode: 'OPPTJENING_AAP_FOR_FORELDREPENGER',
                beskrivelse: 'Har AAP før foreldrepenger og retten var brukt opp uten ny opptjening',
                vilkårshjemmel: {
                    lovverk: 'Folketrygdloven',
                    lovverksversjon: '2020-06-12',
                    kapittel: '8',
                    paragraf: '2',
                    ledd: '2',
                    setning: '2',
                },
            },
            {
                kode: 'IKKE_OPPTJENING_ARBEID_ELLER_YTELSE',
                beskrivelse: 'Ikke arbeid eller likestilt ytelse umiddelbart før arbeidsuførhet',
                vilkårshjemmel: {
                    lovverk: 'Folketrygdloven',
                    lovverksversjon: '2020-06-12',
                    kapittel: '8',
                    paragraf: '2',
                    ledd: '',
                    setning: null,
                    bokstav: null,
                },
            },
        ],
    },
    {
        vilkårshjemmel: {
            lovverk: 'Folketrygdloven',
            lovverksversjon: '1997-05-01',
            kapittel: '2',
            paragraf: '1',
            ledd: null,
            setning: null,
            bokstav: null,
        },
        beskrivelse: 'Medlemskap',
        oppfylt: [
            {
                kode: 'MEDLEMSKAP_JA',
                beskrivelse: 'Den sykmeldte er medlem i folketrygden',
                vilkårshjemmel: {
                    lovverk: 'Folketrygdloven',
                    lovverksversjon: '1997-05-01',
                    kapittel: '2',
                    paragraf: '1',
                    ledd: null,
                    setning: null,
                    bokstav: null,
                },
            },
        ],
        ikkeOppfylt: [
            {
                kode: 'MEDLEMSKAP_NEI',
                beskrivelse: 'Den sykmeldte er ikke medlem i folketrygden',
                vilkårshjemmel: {
                    lovverk: 'Folketrygdloven',
                    lovverksversjon: '1997-05-01',
                    kapittel: '2',
                    paragraf: '1',
                    ledd: null,
                    setning: null,
                    bokstav: null,
                },
            },
        ],
    },
];
