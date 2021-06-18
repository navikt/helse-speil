import dayjs, { Dayjs } from 'dayjs';
import {
    SpesialistArbeidsgiver,
    SpesialistInntektsgrunnlag,
    SpesialistOverstyring,
    SpesialistPerson,
    SpesialistVedtaksperiode,
    SpleisForlengelseFraInfotrygd,
    SpleisPeriodetype,
    SpleisSykdomsdagtype,
    SpleisUtbetalinger,
    SpleisUtbetalingslinje,
    SpleisVedtaksperiodetilstand,
} from 'external-types';
import {
    Inntektskildetype,
    Periodetype,
    Utbetaling,
    Utbetalingstype,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
} from 'internal-types';

import { UtbetalingshistorikkElement } from '../modell/UtbetalingshistorikkElement';
import { ISO_DATOFORMAT, ISO_TIDSPUNKTFORMAT, NORSK_DATOFORMAT } from '../utils/date';

import { mapSykdomstidslinje, mapUtbetalingstidslinje } from './dag';
import { mapHendelse } from './hendelse';
import { mapForlengelseFraInfotrygd } from './infotrygd';
import { inntektskilde } from './oppgaver/oppgaver';
import { tilOverstyrtDag } from './overstyring';
import { mapSimuleringsdata } from './simulering';
import { mapVilkår } from './vilkår';

export const somDato = (dato: string): Dayjs => dayjs(dato ?? null, ISO_DATOFORMAT);

export const somNorskDato = (dato: string): Dayjs => dayjs(dato, NORSK_DATOFORMAT);

export const somKanskjeDato = (dato?: string): Dayjs | undefined => (dato ? somDato(dato) : undefined);

export const somTidspunkt = (dato: string): Dayjs => dayjs(dato, ISO_TIDSPUNKTFORMAT);

export const somKanskjeTidspunkt = (dato?: string): Dayjs | undefined => (dato ? somTidspunkt(dato) : undefined);

export const somProsent = (avviksprosent: number): number => avviksprosent * 100;

export const somInntekt = (inntekt?: number, måneder: number = 1): number | undefined =>
    inntekt ? +(inntekt * måneder).toFixed(2) : undefined;

const mapUtbetaling = (utbetalinger: SpleisUtbetalinger, key: keyof SpleisUtbetalinger): Utbetaling | undefined =>
    utbetalinger[key] && {
        fagsystemId: utbetalinger[key]!.fagsystemId,
        linjer: utbetalinger[key]!.linjer.map((value: SpleisUtbetalingslinje) => ({
            fom: somDato(value.fom),
            tom: somDato(value.tom),
            dagsats: value.dagsats,
            grad: value.grad,
        })),
    };

export class VedtaksperiodeBuilder {
    private unmapped: SpesialistVedtaksperiode;
    private annullerteHistorikkelementer: UtbetalingshistorikkElement[];
    private person: SpesialistPerson;
    private arbeidsgiver: SpesialistArbeidsgiver;
    private overstyringer: SpesialistOverstyring[] = [];
    private vedtaksperiode: Partial<Vedtaksperiode> = {};
    private inntektsgrunnlag?: SpesialistInntektsgrunnlag;
    private problems: Error[] = [];

    setVedtaksperiode = (vedtaksperiode: SpesialistVedtaksperiode) => {
        this.unmapped = vedtaksperiode;
        return this;
    };

    setPerson = (person: SpesialistPerson) => {
        this.person = person;
        return this;
    };

    setArbeidsgiver = (arbeidsgiver: SpesialistArbeidsgiver) => {
        this.arbeidsgiver = arbeidsgiver;
        this.vedtaksperiode.arbeidsgivernavn = arbeidsgiver.navn;
        return this;
    };

    setAnnullertUtbetalingshistorikk = (utbetalingshistorikk: UtbetalingshistorikkElement[]) => {
        this.annullerteHistorikkelementer = utbetalingshistorikk.filter(
            (element) => element.utbetaling.type === Utbetalingstype.ANNULLERING
        );
        return this;
    };

    setOverstyringer = (overstyringer: SpesialistOverstyring[]) => {
        this.overstyringer = overstyringer;
        return this;
    };

    setInntektsgrunnlag = (inntektsgrunnlag: SpesialistInntektsgrunnlag[]) => {
        this.inntektsgrunnlag = inntektsgrunnlag.find(
            (element) =>
                this.unmapped.fullstendig &&
                this.unmapped.vilkår.sykepengedager.skjæringstidspunkt === element.skjæringstidspunkt
        );
        return this;
    };

    setBehandlet = (behandlet: boolean) => {
        this.vedtaksperiode.behandlet = behandlet;
        return this;
    };

    setAutomatiskBehandlet = (automatiskBehandlet: boolean) => {
        this.vedtaksperiode.automatiskBehandlet = automatiskBehandlet;
        return this;
    };

    setForlengelseFraInfotrygd = (erForlengelse?: boolean) => {
        this.vedtaksperiode.forlengelseFraInfotrygd = erForlengelse;
    };

    build = (): { vedtaksperiode?: Vedtaksperiode; problems: Error[] } => {
        if (!this.unmapped || !this.arbeidsgiver) {
            this.problems.push(Error('Kan ikke mappe vedtaksperiode, mangler data.'));
            return { problems: this.problems };
        }
        return this.buildVedtaksperiode();
    };

    private buildVedtaksperiode = (): {
        vedtaksperiode: Vedtaksperiode;
        problems: Error[];
    } => {
        this.mapEnkleProperties();
        this.mapVilkår();
        this.mapTilstand();
        this.mapFomOgTom();
        this.mapHendelser();
        this.mapTidslinjer();
        this.mapSimulering();
        this.mapPeriodetype();
        this.mapUtbetalinger();
        this.mapOppsummering();
        this.mapInntektskilde();
        this.mapOverstyringer();
        this.mapAktivitetslogg();
        this.mapRisikovurdering();
        this.mapInntektsgrunnlag();
        this.leggtilAnnullerteBeregninger();
        this.setBehandlet(!!this.unmapped.godkjentAv || this.unmapped.automatiskBehandlet);
        this.setAutomatiskBehandlet(this.unmapped.automatiskBehandlet);
        this.setForlengelseFraInfotrygd(mapForlengelseFraInfotrygd(this.unmapped.forlengelseFraInfotrygd));
        return { vedtaksperiode: this.vedtaksperiode as Vedtaksperiode, problems: this.problems };
    };

    private mapEnkleProperties = () => {
        this.vedtaksperiode.beregningIder = this.unmapped.beregningIder ?? [];
        this.vedtaksperiode.id = this.unmapped.id;
        this.vedtaksperiode.gruppeId = this.unmapped.gruppeId;
        this.vedtaksperiode.godkjentAv = this.unmapped.godkjentAv;
        this.vedtaksperiode.godkjenttidspunkt = this.unmapped.godkjenttidspunkt
            ? somKanskjeTidspunkt(this.unmapped.godkjenttidspunkt)
            : undefined;
        this.vedtaksperiode.oppgavereferanse = this.unmapped.oppgavereferanse || undefined;
        this.vedtaksperiode.utbetalingsreferanse = this.unmapped.utbetalingsreferanse;
        this.vedtaksperiode.fullstendig = true;
    };

    private leggtilAnnullerteBeregninger = () => {
        const annullering = this.annullerteHistorikkelementer.find(
            (fagsystemId) =>
                fagsystemId.utbetaling.arbeidsgiverFagsystemId ===
                this.vedtaksperiode.utbetalinger?.arbeidsgiverUtbetaling?.fagsystemId
        );
        if (annullering) this.vedtaksperiode.beregningIder?.push(annullering.id);
    };

    private mapVilkår = () => {
        const { vilkår, problems } = mapVilkår(this.unmapped, this.inntektsgrunnlag);
        this.vedtaksperiode.vilkår = vilkår;
        this.problems.push(...problems);
    };

    private mapTilstand = () => {
        this.vedtaksperiode.tilstand =
            (this.inneholderAnnullerteDager() && Vedtaksperiodetilstand.Annullert) ||
            (this.venterPåSaksbehandleroppgave() && Vedtaksperiodetilstand.Venter) ||
            Vedtaksperiodetilstand[this.unmapped.tilstand] ||
            Vedtaksperiodetilstand.Ukjent;
    };

    private mapHendelser = () => {
        this.vedtaksperiode.hendelser = this.unmapped.hendelser.map(mapHendelse);
    };

    private mapFomOgTom = () => {
        this.vedtaksperiode.fom = somDato(this.unmapped.fom);
        this.vedtaksperiode.tom = somDato(this.unmapped.tom);
    };

    private mapTidslinjer = () => {
        this.vedtaksperiode.sykdomstidslinje = mapSykdomstidslinje(this.unmapped.sykdomstidslinje);
        this.vedtaksperiode.utbetalingstidslinje = mapUtbetalingstidslinje(
            this.unmapped.utbetalingstidslinje,
            this.unmapped.vilkår
        );
    };

    private mapSimulering = () => {
        this.vedtaksperiode.simuleringsdata = mapSimuleringsdata(this.unmapped.simuleringsdata);
    };

    private mapPeriodetype = () => {
        const mapExistingPeriodetype = (): Periodetype => {
            switch (this.unmapped.periodetype) {
                case SpleisPeriodetype.FØRSTEGANGSBEHANDLING:
                    return Periodetype.Førstegangsbehandling;
                case SpleisPeriodetype.OVERGANG_FRA_IT:
                case SpleisPeriodetype.INFOTRYGDFORLENGELSE:
                    return Periodetype.Infotrygdforlengelse;
                case SpleisPeriodetype.FORLENGELSE:
                    return Periodetype.Forlengelse;
                case SpleisPeriodetype.STIKKPRØVE:
                    return Periodetype.Stikkprøve;
                case SpleisPeriodetype.RISK_QA:
                    return Periodetype.RiskQa;
            }
        };
        const mapPeriodetype = (): Periodetype => {
            if (this.erFørstegangsbehandling()) {
                return Periodetype.Førstegangsbehandling;
            } else if (this.erInfotrygdforlengelse()) {
                return Periodetype.Infotrygdforlengelse;
            } else {
                return Periodetype.Forlengelse;
            }
        };
        this.vedtaksperiode.periodetype = this.unmapped.periodetype ? mapExistingPeriodetype() : mapPeriodetype();
    };

    private mapInntektskilde = () => {
        this.vedtaksperiode.inntektskilde = inntektskilde(this.unmapped.inntektskilde);
    };

    private mapUtbetalinger = () => {
        this.vedtaksperiode.utbetalinger = this.unmapped.utbetalinger && {
            arbeidsgiverUtbetaling: mapUtbetaling(this.unmapped.utbetalinger, 'arbeidsgiverUtbetaling'),
            personUtbetaling: mapUtbetaling(this.unmapped.utbetalinger, 'personUtbetaling'),
        };
    };

    private mapOppsummering = () => {
        this.vedtaksperiode.oppsummering = {
            antallUtbetalingsdager: this.unmapped.utbetalingstidslinje.filter((dag) => !!dag.utbetaling).length,
            totaltTilUtbetaling: this.unmapped.totalbeløpArbeidstaker,
        };
    };

    private mapOverstyringer = () => {
        this.vedtaksperiode.overstyringer = this.overstyringer
            .filter((overstyring) =>
                overstyring.overstyrteDager
                    ?.map((dag) => dayjs(dag.dato))
                    .every(
                        (dato) =>
                            this.vedtaksperiode.fom?.isSameOrBefore(dato) &&
                            this.vedtaksperiode.tom?.isSameOrAfter(dato)
                    )
            )
            .map((overstyring) => ({
                ...overstyring,
                timestamp: dayjs(overstyring.timestamp),
                overstyrteDager: overstyring.overstyrteDager.map(tilOverstyrtDag),
            }))
            .sort((a, b) => (a.timestamp.isBefore(b.timestamp) ? 1 : -1));
    };

    private mapRisikovurdering = () => {
        this.vedtaksperiode.risikovurdering = this.unmapped.risikovurdering || undefined;
    };

    private mapAktivitetslogg = () => {
        const fjernDuplikater = (varsel: string, i: number, varsler: string[]) =>
            !varsler.slice(i + 1).find((v) => v === varsel);
        this.vedtaksperiode.aktivitetslog =
            this.unmapped.varsler?.length > 0
                ? this.unmapped.varsler.filter(fjernDuplikater)
                : this.unmapped.aktivitetslogg.map(({ melding }) => melding).filter(fjernDuplikater);
    };

    private mapInntektsgrunnlag = () => {
        const arbeidsgiverForOrganisasjonsnummer = (organisasjonsnummer: string): SpesialistArbeidsgiver | undefined =>
            this.person?.arbeidsgivere.find((it) => it.organisasjonsnummer === organisasjonsnummer);

        try {
            this.vedtaksperiode.inntektsgrunnlag = this.inntektsgrunnlag && {
                sykepengegrunnlag: this.inntektsgrunnlag.sykepengegrunnlag ?? undefined,
                omregnetÅrsinntekt: this.inntektsgrunnlag.omregnetÅrsinntekt ?? undefined,
                maksUtbetalingPerDag: this.inntektsgrunnlag.maksUtbetalingPerDag ?? undefined,
                sammenligningsgrunnlag: this.inntektsgrunnlag.sammenligningsgrunnlag ?? undefined,
                avviksprosent: this.inntektsgrunnlag.avviksprosent ?? undefined,
                organisasjonsnummer: this.arbeidsgiver.organisasjonsnummer,
                skjæringstidspunkt: dayjs(this.inntektsgrunnlag.skjæringstidspunkt),
                inntekter: this.inntektsgrunnlag.inntekter.map((arbeidsgiverinntekt) => ({
                    arbeidsgivernavn:
                        arbeidsgiverForOrganisasjonsnummer(arbeidsgiverinntekt.arbeidsgiver)?.navn ?? 'Arbeidsgiver',
                    organisasjonsnummer: arbeidsgiverinntekt.arbeidsgiver,
                    omregnetÅrsinntekt:
                        (arbeidsgiverinntekt.omregnetÅrsinntekt && {
                            ...arbeidsgiverinntekt.omregnetÅrsinntekt,
                            kilde: Inntektskildetype[arbeidsgiverinntekt.omregnetÅrsinntekt.kilde],
                            inntekterFraAOrdningen: arbeidsgiverinntekt.omregnetÅrsinntekt.inntekterFraAOrdningen,
                        }) ??
                        undefined,
                    sammenligningsgrunnlag:
                        (arbeidsgiverinntekt.sammenligningsgrunnlag && {
                            ...arbeidsgiverinntekt.sammenligningsgrunnlag,
                            inntekterFraAOrdningen: arbeidsgiverinntekt.sammenligningsgrunnlag.inntekterFraAOrdningen,
                        }) ??
                        undefined,
                    bransjer: arbeidsgiverForOrganisasjonsnummer(arbeidsgiverinntekt.arbeidsgiver)?.bransjer?.length
                        ? arbeidsgiverForOrganisasjonsnummer(arbeidsgiverinntekt.arbeidsgiver)?.bransjer!
                        : ['Ukjent'],
                    refusjon: true,
                    forskuttering: true,
                    arbeidsforhold:
                        this.person?.arbeidsforhold
                            ?.filter((it) => it.organisasjonsnummer === arbeidsgiverinntekt.arbeidsgiver)
                            .map((it) => ({
                                stillingstittel: it.stillingstittel,
                                stillingsprosent: it.stillingsprosent,
                                startdato: dayjs(it.startdato),
                                sluttdato: it.sluttdato ? dayjs(it.sluttdato) : undefined,
                            })) ?? [],
                })),
            };
        } catch (error) {
            this.problems.push(error);
        }
    };

    private erInfotrygdforlengelse = (): boolean =>
        this.unmapped.forlengelseFraInfotrygd === SpleisForlengelseFraInfotrygd.JA;

    private erFørstegangsbehandling = (): boolean => {
        const førsteUtbetalingsdag = this.unmapped.utbetalinger?.arbeidsgiverUtbetaling?.linjer[0].fom ?? dayjs(0);
        return this.unmapped.utbetalingstidslinje.some((dag) => dayjs(dag.dato).isSame(førsteUtbetalingsdag));
    };

    private inneholderAnnullerteDager = (): boolean =>
        !!this.unmapped.sykdomstidslinje.find((dag) => dag.type === SpleisSykdomsdagtype.ANNULLERT_DAG);

    private venterPåSaksbehandleroppgave = (): boolean =>
        this.unmapped.tilstand === SpleisVedtaksperiodetilstand.Oppgaver && this.unmapped.oppgavereferanse === null;
}
