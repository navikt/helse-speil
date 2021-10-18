import i18n, { Resource, ResourceKey } from 'i18next';
import { initReactI18next } from 'react-i18next';

// noinspection JSUnusedLocalSymbols
interface Translation {
    mvp: string;
    neste: string;
    empty_state_message: string;
    'informasjon ikke tilgjengelig': string;
    oversikt: ResourceKey;
    fordeling: ResourceKey;
    oppsummering: ResourceKey;
    sykdomsvilkår: ResourceKey;
    vilkår: ResourceKey;
    inntektskilder: ResourceKey;
    sykepengegrunnlag: ResourceKey;
    sykmeldingsperiode: ResourceKey;
    utbetalingsoversikt: ResourceKey;
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
                opprettet: 'Opprettet',
            },
            sykdomsvilkår: {
                sykdomsvilkår: 'Sykdomsvilkår må vurderes manuelt',
            },
            vilkår: {
                vilkår_oppfylt: 'Vilkår oppfylt',
                medlemskap: 'Medlemskap',
            },
            inntektskilder: {
                inntektsmeldinger: 'Fra Inntektsmelding',
                månedsinntekt: 'Månedsbeløp',
                årsinntekt: 'Omregnet årsinntekt som legges til grunn',
                aordningen: 'A-Ordningen må sjekkes manuelt',
                refusjon: 'Refusjon til arbeidsgiver',
                arbeidsgiverperiode: 'Betaler arbeidsgiverperiode',
                inntekt: 'Inntekt',
                relasjon: 'Nær relasjon',
                kilder: 'Inntektskilde som må sjekkes manuelt',
                sjekket_ytelser: 'Ytelser som er sjekket',
                sykepengegrunnlag: 'Sykepengegrunnlag før 6G',
                ikke_sjekket_ytelser: 'Ytelser som må sjekkes manuelt',
                foreldrepenger: 'Foreldrepenger',
                svangerskapspenger: 'Svangerskapspenger',
                aap: 'Arbeidsavklaringspenger',
                dagpenger: 'Dagpenger',
                pleiepenger: 'Pleiepenger',
            },
            sykepengegrunnlag: {
                inntektsmeldinger: 'Hentet fra Inntektsmelding',
                månedsinntekt: 'Beregnet månedsinntekt',
                årsinntekt: 'Omregnet årsinntekt',
                aordningen: 'A-Ordningen må sjekkes manuelt',
                sammenligningsgrunnlag: 'Sammenligningsgrunnlag',
                avvik: 'Avvik må sjekkes manuelt',
                redusert: 'Redusert til 6G',
                sykepengegrunnlag: 'Sykepengegrunnlag',
            },
            utbetalingsoversikt: {
                refusjon: 'Refusjon til arbeidsgiver',
                betaler: 'Betaler arbeidsgiverperiode',
                sykepengegrunnlag: 'Sykepengegrunnlag',
                dager: 'Utbetalingen blir korrekt',
                sykmeldingsgrad: 'Sykmeldingsgrad',
                utbetalingsoversikt: 'Utbetalingsoversikt',
                forskutterer: 'Arbeidsgiver forskutterer',
            },
            oppsummering: {
                tittel: 'Oppsummering',
                arbeidsgiver: 'Arbeidsgiver',
                orgnr: 'Organisasjonsnummer',
                refusjon: 'Refusjon til arbeidsgiver',
                betaler: 'Betaler arb.giverperiode',
                sykepengegrunnlag: 'Sykepengegrunnlag',
                antall_utbetalingsdager: 'Utbetalingsdager',
                utbetaling: 'Utbetaling',
                beløp: 'Beløp til utbetaling',
                utbetaling_til: 'Utbetaling til',
            },
            sykmeldingsperiode: {
                dager: 'Dagene er riktig kategorisert',
            },
        },
    },
};

// noinspection JSIgnoredPromiseFromCall
i18n.use(initReactI18next).init({
    resources,
    lng: 'no',
    interpolation: {
        escapeValue: false,
    },
});

// noinspection JSUnusedGlobalSymbols
export default i18n;
