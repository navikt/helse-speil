const bokmål = {};

const ordbøker = {
    bokmål
};

const sider = {
    sykdomsvilkår: 'sykdomsvilkår',
    inngangsvilkår: 'inngangsvilkår',
    beregning: 'beregning',
    periode: 'periode',
    utbetaling: 'utbetaling',
    oppsummering: 'oppsummering'
};

Object.keys(sider).forEach(side => (bokmål[side] = {}));

bokmål.mvp = 'Hvilke elementer i søknaden utløser automatisk behandling';
bokmål.neste = 'Neste';
bokmål['empty_state_message'] =
    'Gjør oppslag på en person ved å skrive inn fødselsnummer eller aktør-ID i feltet over';
bokmål['informasjon ikke tilgjengelig'] = 'Ikke klart';

bokmål.sykdomsvilkår['sykdomsvilkår_oppfylt'] = 'Sykdomsvilkår er oppfylt';
bokmål.sykdomsvilkår['mindre_enn_8_uker'] = 'Mindre enn 8 uker sammenhengende';
bokmål.sykdomsvilkår['første_sykdomsdag'] = 'Første sykdomsdag';
bokmål.sykdomsvilkår['siste_sykdomsdag'] = 'Siste sykdomsdag';
bokmål.sykdomsvilkår['ingen_yrkesskade'] = 'Ingen yrkesskade';

bokmål.inngangsvilkår.tittel = 'Inngangsvilkår';
bokmål.inngangsvilkår['overskrift -> inngangsvilkår oppfylt'] =
    'Inngangsvilkår oppfylt';
bokmål.inngangsvilkår['overskrift -> medlemskap'] = 'Medlemskap';
bokmål.inngangsvilkår['overskrift -> opptjening'] = 'Opptjening';
bokmål.inngangsvilkår['overskrift -> mer enn 0,5G'] = 'Mer enn 0,5G';
bokmål.inngangsvilkår['overskrift -> søknadsfrist'] = 'Søknadsfrist';
bokmål.inngangsvilkår['overskrift -> dager igjen'] = 'Dager igjen';
bokmål.inngangsvilkår['overskrift -> under 67 år'] = 'Under 67 år';

bokmål.inngangsvilkår['etikett -> statsborgerskap'] = 'Statsborgerskap';
bokmål.inngangsvilkår['etikett -> bosatt'] = 'Bosatt i Norge';
bokmål.inngangsvilkår['etikett -> diskresjonskode'] = 'Diskresjonskode';

bokmål.inngangsvilkår['etikett.førsteSykdomsdag'] = 'Første sykdomsdag';
bokmål.inngangsvilkår['etikett.startdato'] = 'Startdato';
bokmål.inngangsvilkår['etikett.sluttdato'] = 'Sluttdato';
bokmål.inngangsvilkår['etikett.antall dager'] = 'Antall dager (>28)';

bokmål.inngangsvilkår.etikett_sykepengegrunnlaget = 'Sykepengegrunnlaget';
bokmål.inngangsvilkår.etikett_05Ger = '0,5G er {$1} kr';
bokmål.inngangsvilkår.etikett_sendt_nav = 'Sendt NAV';
bokmål.inngangsvilkår.etikett_siste_sykdomsdag = 'Siste sykdomsdag';
bokmål.inngangsvilkår.etikett_innen_3_mnd = 'Innen 3 mnd';

bokmål.inngangsvilkår['etikett: første fraværsdag'] = 'Første fraværsdag';
bokmål.inngangsvilkår['etikett: første sykepengedag'] = 'Første sykepengedag';
bokmål.inngangsvilkår['etikett: yrkesstatus'] = 'Yrkesstatus';
bokmål.inngangsvilkår['etikett: tidligere perioder'] = 'Tidligere perioder';
bokmål.inngangsvilkår['etikett: max dato'] = 'Max dato';

bokmål.inngangsvilkår['etikett -> alder'] = 'Alder';

bokmål.beregning['tittel'] = 'Beregning av sykepengegrunnlag og dagsats';
bokmål.beregning['inntektsmeldinger'] = 'Hentet fra inntektsmelding';
bokmål.beregning['månedsinntekt'] = 'Månedsinntekt';
bokmål.beregning['årsinntekt'] = 'Omregnet årsinntekt';
bokmål.beregning['aordningen'] = 'Hentet fra A-Ordningen';
bokmål.beregning['beregningsperioden'] = 'Beregningsperioden';
bokmål.beregning['sammenligningsgrunnlag'] = 'Sammenligningsgrunnlag';
bokmål.beregning['avvik'] = 'Utregnet avvik';
bokmål.beregning['sykepengegrunnlag'] = 'Sykepengegrunnlag';
bokmål.beregning['dagsats'] = 'Dagsats';

bokmål.periode['tittel'] = 'Sykepengeperiode';
bokmål.periode['kalenderdager'] = 'Antall kalenderdager';
bokmål.periode['arbeidsgiverperiode'] = 'Antall dager i arbeidsgiverperioden';
bokmål.periode['virkedager'] = 'Antall virkedager';
bokmål.periode['ferie'] = 'Ferie';
bokmål.periode['antall_utbetalingsdager'] = 'Antall utbetalingsdager';
bokmål.periode['sykmeldingsgrad'] = 'Sykmeldingsgrad';
bokmål.periode['friskmelding'] = 'Ikke utfylt friskmelding i søknaden';
bokmål.periode['gradering'] = 'Sykmeldingen er på 100%';

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
bokmål.oppsummering['månedsbeløp'] = 'Månedsbeløp';
bokmål.oppsummering['dagsats'] = 'Dagsats';
bokmål.oppsummering['antall_utbetalingsdager'] = 'Utbetalingsdager';
bokmål.oppsummering['fom'] = 'Sykmeldt fra og med';
bokmål.oppsummering['tom'] = 'Sykmeldt til og med';
bokmål.oppsummering['sykmeldingsgrad'] = 'Sykmeldingsgrad';
bokmål.oppsummering['utbetalesFom'] = 'Utbetales fra og med';
bokmål.oppsummering['utbetalesTom'] = 'Utbetales til og med';
bokmål.oppsummering['utbetaling'] = 'Utbetaling';
bokmål.oppsummering['innrapportert'] = 'Innrapportert';
bokmål.oppsummering['ingen_uenigheter'] = 'Ingen uenigheter';
bokmål.oppsummering['felter_uten_årsak'] =
    'Felter uten oppgitt årsak blir ikke sendt inn.';
bokmål.oppsummering['oppgi_årsak'] = 'Du bør skrive inn årsak';

const hardkodetBrukerspråk = 'bokmål';

export const tekster = nøkkel => ordbøker[hardkodetBrukerspråk][nøkkel];
export const inngangsvilkårtekster = nøkkel =>
    ordbøker[hardkodetBrukerspråk][sider.inngangsvilkår][nøkkel];
export const sykdomsvilkårtekster = nøkkel =>
    ordbøker[hardkodetBrukerspråk][sider.sykdomsvilkår][nøkkel];
export const beregningstekster = nøkkel =>
    ordbøker[hardkodetBrukerspråk][sider.beregning][nøkkel];
export const periodetekster = nøkkel =>
    ordbøker[hardkodetBrukerspråk][sider.periode][nøkkel];
export const utbetalingstekster = nøkkel =>
    ordbøker[hardkodetBrukerspråk][sider.utbetaling][nøkkel];
export const oppsummeringstekster = nøkkel =>
    ordbøker[hardkodetBrukerspråk][sider.oppsummering][nøkkel];
