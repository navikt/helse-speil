import i18n, { Resource, ResourceKey, ResourceLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';

interface Translation {
    mvp: string;
    neste: string;
    empty_state_message: string;
    'informasjon ikke tilgjengelig': string;
    oversikt: ResourceKey;
    fordeling: ResourceKey;
    oppsummering: ResourceKey;
    sykdomsvilkår: ResourceKey;
    inngangsvilkår: ResourceKey;
    inntektskilder: ResourceKey;
    sykepengegrunnlag: ResourceKey;
    sykmeldingsperiode: ResourceKey;
    utbetalingsoversikt: ResourceKey;
}

interface Language {
    translation: Translation;
}

interface SpeilResource extends Resource {
    bokmål: ResourceLanguage;
}

const resources: Resource = {
    no: {
        translation: {
            mvp: 'Gjeldende kriterier for automatisk saksbehandling',
            neste: 'Neste',
            empty_state_message:
                'Gjør oppslag på en vedtaksperiode ved å skrive inn fødselsnummer eller aktør-ID i feltet over',
            'informasjon ikke tilgjengelig': 'Ikke klart',
            oversikt: {
                tittel: 'Neste saker',
                søker: 'Søker',
                tildeling: 'Tildelt',
                tidspunkt: 'Tidspunkt'
            },
            sykdomsvilkår: {
                sykdomsvilkår: 'Sykdomsvilkår må vurderes manuelt'
            },
            inngangsvilkår: {
                inngangsvilkår_oppfylt: 'Inngangsvilkår oppfylt',
                medlemskap: 'Medlemskap'
            },
            inntektskilder: {
                inntektsmeldinger: 'Fra inntektsmelding',
                månedsinntekt: 'Månedsbeløp',
                årsinntekt: 'Omregnet årsinntekt som legges til grunn',
                aordningen: 'A-Ordningen må sjekkes manuelt',
                refusjon: 'Refusjon til arbeidsgiver',
                arbeidsgiverperiode: 'Betaler arbeidsgiverperiode',
                inntekt: 'Inntekt',
                relasjon: 'Nær relasjon',
                kilder: 'Inntektskilder som må sjekkes manuelt',
                sjekket_ytelser: 'Ytelser som er sjekket',
                ikke_sjekket_ytelser: 'Ytelser som må sjekkes manuelt',
                frilans: 'Frilansinntekt',
                næring: 'Næringsinntekt',
                foreldrepenger: 'Ingen foreldrepenger',
                svangerskapspenger: 'Ingen svangerskapspenger',
                aap: 'Arbeidsavklaringspenger',
                dagpenger: 'Dagpenger',
                pleiepenger: 'Pleiepenger'
            },
            sykepengegrunnlag: {
                inntektsmeldinger: 'Hentet fra inntektsmelding',
                månedsinntekt: 'Beregnet månedsinntekt',
                årsinntekt: 'Omregnet årsinntekt',
                aordningen: 'A-Ordningen må sjekkes manuelt',
                sammenligningsgrunnlag: 'Sammenligningsgrunnlag',
                avvik: 'Avvik må sjekkes manuelt',
                redusert: 'Redusert til 6G',
                sykepengegrunnlag: 'Sykepengegrunnlag',
                dagsats: 'Dagsats'
            },
            utbetalingsoversikt: {
                refusjon: 'Refusjon til arbeidsgiver',
                betaler: 'Betaler arbeidsgiverperiode',
                sykepengegrunnlag: 'Sykepengegrunnlag',
                dagsats: 'Dagsats',
                dager: 'Utbetalingen blir korrekt',
                sykmeldingsgrad: 'Sykmeldingsgrad',
                utbetalingsoversikt: 'Utbetalingsoversikt',
                forskutterer: 'Arbeidsgiver forskutterer'
            },
            oppsummering: {
                tittel: 'Oppsummering',
                arbeidsgiver: 'Arbeidsgiver',
                orgnr: 'Organisasjonsnummer',
                refusjon: 'Refusjon til arbeidsgiver',
                betaler: 'Betaler arb.giverperiode',
                sykepengegrunnlag: 'Sykepengegrunnlag',
                dagsats: 'Dagsats',
                antall_utbetalingsdager: 'Utbetalingsdager',
                utbetaling: 'Utbetaling',
                beløp: 'Beløp til utbetaling',
                utbetaling_til: 'Utbetaling til'
            },
            sykmeldingsperiode: {
                dager: 'Dagene er riktig kategorisert'
            }
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'no',
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
