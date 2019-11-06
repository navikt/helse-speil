const bokmål = {};

const ordbøker = {
    bokmål
};

const sider = {
    oversikt: 'oversikt',
    sykdomsvilkår: 'sykdomsvilkår',
    inngangsvilkår: 'inngangsvilkår',
    inntektskilder: 'inntektskilder',
    sykepengegrunnlag: 'sykepengegrunnlag',
    fordeling: 'fordeling',
    utbetaling: 'utbetaling',
    oppsummering: 'oppsummering',
    sykmeldingsperiode: 'sykmeldingsperiode'
};

Object.keys(sider).forEach(side => (bokmål[side] = {}));

bokmål.mvp = 'Gjeldende kriterier for automatisk saksbehandling';
bokmål.neste = 'Neste';
bokmål['empty_state_message'] =
    'Gjør oppslag på en person ved å skrive inn fødselsnummer eller aktør-ID i feltet over';
bokmål['informasjon ikke tilgjengelig'] = 'Ikke klart';

bokmål.oversikt['tittel'] = 'Neste behandlinger';
bokmål.oversikt['søker'] = 'Søker';
bokmål.oversikt['tildeling'] = 'Tildelt';
bokmål.oversikt['periode'] = 'Søknadsperiode';

bokmål.sykdomsvilkår['tittel'] = 'Sykdomsvilkår';
bokmål.sykdomsvilkår['sykdomsvilkår_oppfylt'] = 'Sykdomsvilkår er oppfylt';
bokmål.sykdomsvilkår['mindre_enn_8_uker'] = 'Mindre enn 8 uker sammenhengende';
bokmål.sykdomsvilkår['første_sykdomsdag'] = 'Første sykmeldingsdag';
bokmål.sykdomsvilkår['siste_sykdomsdag'] = 'Siste sykmeldingsdag';
bokmål.sykdomsvilkår['ingen_yrkesskade'] = 'Ingen yrkesskade';

bokmål.inngangsvilkår.tittel = 'Inngangsvilkår';
bokmål.inngangsvilkår.inngangsvilkår_oppfylt = 'Inngangsvilkår oppfylt';
bokmål.inngangsvilkår.medlemskap = 'Medlemskap';

bokmål.inntektskilder.tittel = 'Inntektskilder';

bokmål.sykepengegrunnlag['tittel'] = 'Beregning av sykepengegrunnlag og dagsats';
bokmål.sykepengegrunnlag['inntektsmeldinger'] = 'Hentet fra inntektsmelding';
bokmål.sykepengegrunnlag['månedsinntekt'] = 'Månedsinntekt';
bokmål.sykepengegrunnlag['årsinntekt'] = 'Omregnet årsinntekt';
bokmål.sykepengegrunnlag['aordningen'] = 'Hentet fra A-Ordningen';
bokmål.sykepengegrunnlag['beregningsperioden'] = 'Beregningsperioden';
bokmål.sykepengegrunnlag['sammenligningsgrunnlag'] = 'Sammenligningsgrunnlag';
bokmål.sykepengegrunnlag['avvik'] = 'Utregnet avvik';
bokmål.sykepengegrunnlag['sykepengegrunnlag'] = 'Sykepengegrunnlag';
bokmål.sykepengegrunnlag['dagsats'] = 'Dagsats';

bokmål.fordeling['tittel'] = 'Fordeling';

bokmål.utbetaling['tittel'] = 'Beregning av utbetaling';
bokmål.utbetaling['refusjon'] = 'Refusjon til arbeidsgiver';
bokmål.utbetaling['betaler'] = 'Betaler arbeidsgiverperiode';
bokmål.utbetaling['sykepengegrunnlag'] = 'Sykepengegrunnlag';
bokmål.utbetaling['dagsats'] = 'Dagsats';
bokmål.utbetaling['dager'] = 'Utbetalingsdager';
bokmål.utbetaling['sykmeldingsgrad'] = 'Sykmeldingsgrad';
bokmål.utbetaling['utbetaling'] = 'Utbetaling';
bokmål.utbetaling['forskutterer'] = 'Arbeidsgiver forskutterer';

bokmål.oppsummering['tittel'] = 'Oppsummering';
bokmål.oppsummering['sykdomsvilkår'] = 'Sykdomsvilkår er oppfylt';
bokmål.oppsummering['inngangsvilkår'] = 'Inngangsvilkår er oppfylt';
bokmål.oppsummering['arbeidsgiver'] = 'Arbeidsgiver';
bokmål.oppsummering['orgnr'] = 'Organisasjonsnummer';
bokmål.oppsummering['refusjon'] = 'Refusjon til arbeidsgiver';
bokmål.oppsummering['betaler'] = 'Betaler arb.giverperiode';
bokmål.oppsummering['fordeling'] = 'Fordeling';
bokmål.oppsummering['sykepengegrunnlag'] = 'Sykepengegrunnlag';
bokmål.oppsummering['månedsbeløp'] = 'Månedsbeløp ved 100 % grad';
bokmål.oppsummering['dagsats'] = 'Dagsats';
bokmål.oppsummering['antall_utbetalingsdager'] = 'Utbetalingsdager';
bokmål.oppsummering['fom'] = 'Sykmeldt fra og med';
bokmål.oppsummering['tom'] = 'Sykmeldt til og med';
bokmål.oppsummering['sykmeldingsgrad'] = 'Sykmeldingsgrad';
bokmål.oppsummering['utbetalesFom'] = 'Utbetales fra og med';
bokmål.oppsummering['utbetalesTom'] = 'Utbetales til og med';
bokmål.oppsummering['utbetaling'] = 'Utbetaling';
bokmål.oppsummering['innrapportert'] = 'Innrapportering';
bokmål.oppsummering['ingen_uenigheter'] = 'Ingen uenigheter';
bokmål.oppsummering['felter_uten_årsak'] = 'Felter uten oppgitt årsak blir ikke sendt inn.';
bokmål.oppsummering['oppgi_årsak'] = 'Du bør skrive inn årsak';

bokmål.sykmeldingsperiode['dager'] = 'Dagene er riktig kategorisert';

const hardkodetBrukerspråk = 'bokmål';

const createLookupFunction = page => nøkkel => ordbøker[hardkodetBrukerspråk][page][nøkkel];

export const tekster = nøkkel => ordbøker[hardkodetBrukerspråk][nøkkel];
export const oversikttekster = createLookupFunction(sider.oversikt);
export const inngangsvilkårtekster = createLookupFunction(sider.inngangsvilkår);
export const inntektskildertekster = createLookupFunction(sider.inntektskilder);
export const sykdomsvilkårtekster = createLookupFunction(sider.sykdomsvilkår);
export const sykepengegrunnlagstekster = createLookupFunction(sider.sykepengegrunnlag);
export const fordelingtekster = createLookupFunction(sider.fordeling);
export const utbetalingstekster = createLookupFunction(sider.utbetaling);
export const oppsummeringstekster = createLookupFunction(sider.oppsummering);
export const sykmeldingsperiodetekster = createLookupFunction(sider.sykmeldingsperiode);
