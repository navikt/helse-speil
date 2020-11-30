import dayjs, { Dayjs } from 'dayjs';
import { ISO_DATOFORMAT, ISO_TIDSPUNKTFORMAT, NORSK_DATOFORMAT } from '../utils/date';
import {
    Periodetype,
    UfullstendigVedtaksperiode,
    Utbetaling,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
} from 'internal-types';
import {
    SpesialistArbeidsgiver,
    SpesialistOverstyring,
    SpesialistVedtaksperiode,
    SpleisForlengelseFraInfotrygd,
    SpleisPeriodetype,
    SpleisSykdomsdag,
    SpleisSykdomsdagtype,
    SpleisUtbetalinger,
    SpleisUtbetalingslinje,
} from 'external-types';
import { mapForlengelseFraInfotrygd } from './infotrygd';
import { mapSykdomstidslinje, mapUtbetalingstidslinje } from './dag';
import { mapSimuleringsdata } from './simulering';
import { mapVilkår } from './vilkår';
import { mapHendelse } from './hendelse';
import { tilOverstyrtDag } from './overstyring';

export const somDato = (dato: string): Dayjs => dayjs(dato ?? null, ISO_DATOFORMAT);

export const somNorskDato = (dato: string): Dayjs => dayjs(dato, NORSK_DATOFORMAT);

export const somKanskjeDato = (dato?: string): Dayjs | undefined => (dato ? somDato(dato) : undefined);

export const somTidspunkt = (dato: string): Dayjs => dayjs(dato, ISO_TIDSPUNKTFORMAT);

export const somProsent = (avviksprosent: number): number => avviksprosent * 100;

export const somInntekt = (inntekt?: number, måneder: number = 1): number | undefined =>
    inntekt ? +(inntekt * måneder).toFixed(2) : undefined;

export const somÅrsinntekt = (inntekt?: number): number | undefined => somInntekt(inntekt, 12);

export const mapUtbetaling = (
    utbetalinger: SpleisUtbetalinger,
    key: keyof SpleisUtbetalinger
): Utbetaling | undefined =>
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
    private arbeidsgiver: SpesialistArbeidsgiver;
    private overstyringer: SpesialistOverstyring[] = [];
    private vedtaksperiode: Partial<Vedtaksperiode> = {};
    private problems: Error[] = [];

    setVedtaksperiode = (vedtaksperiode: SpesialistVedtaksperiode) => {
        this.unmapped = vedtaksperiode;
        return this;
    };

    setArbeidsgiver = (arbeidsgiver: SpesialistArbeidsgiver) => {
        this.arbeidsgiver = arbeidsgiver;
        return this;
    };

    setOverstyringer = (overstyringer: SpesialistOverstyring[]) => {
        this.overstyringer = overstyringer;
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

    build = (): { vedtaksperiode?: Vedtaksperiode | UfullstendigVedtaksperiode; problems: Error[] } => {
        if (!this.unmapped || !this.arbeidsgiver) {
            this.problems.push(Error('Kan ikke mappe vedtaksperiode, mangler data.'));
            return { problems: this.problems };
        }
        return this.unmapped.fullstendig ? this.buildVedtaksperiode() : this.buildUfullstendigVedtaksperiode();
    };

    private buildUfullstendigVedtaksperiode = (): {
        vedtaksperiode: UfullstendigVedtaksperiode;
        problems: Error[];
    } => ({
        vedtaksperiode: {
            id: this.unmapped.id,
            fom: dayjs(this.unmapped.fom),
            tom: dayjs(this.unmapped.tom),
            kanVelges: false,
            tilstand: Vedtaksperiodetilstand[this.unmapped.tilstand] ?? Vedtaksperiodetilstand.Ukjent,
        },
        problems: this.problems,
    });

    private buildVedtaksperiode = (): {
        vedtaksperiode: Vedtaksperiode;
        problems: Error[];
    } => {
        this.trimLedendeArbeidsdager();
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
        this.mapOverstyringer();
        this.mapInntektskilder();
        this.mapAktivitetslogg();
        this.mapRisikovurdering();
        this.mapSykepengegrunnlag();
        this.setBehandlet(!!this.unmapped.godkjentAv || this.unmapped.automatiskBehandlet);
        this.setAutomatiskBehandlet(this.unmapped.automatiskBehandlet === true);
        this.setForlengelseFraInfotrygd(mapForlengelseFraInfotrygd(this.unmapped.forlengelseFraInfotrygd));
        return { vedtaksperiode: this.vedtaksperiode as Vedtaksperiode, problems: this.problems };
    };

    private trimLedendeArbeidsdager = () => {
        const førsteArbeidsdag = this.unmapped.sykdomstidslinje.findIndex(
            (dag: SpleisSykdomsdag) =>
                dag.type === SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING ||
                dag.type === SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD ||
                dag.type === SpleisSykdomsdagtype.IMPLISITT_DAG ||
                dag.type === SpleisSykdomsdagtype.ARBEIDSDAG
        );
        if (førsteArbeidsdag !== 0) return;
        const førsteIkkearbeidsdag = this.unmapped.sykdomstidslinje.findIndex(
            (dag) =>
                dag.type !== SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING &&
                dag.type !== SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD &&
                dag.type !== SpleisSykdomsdagtype.IMPLISITT_DAG &&
                dag.type !== SpleisSykdomsdagtype.ARBEIDSDAG
        );
        this.unmapped.sykdomstidslinje = this.unmapped.sykdomstidslinje.slice(førsteIkkearbeidsdag);
    };

    private mapEnkleProperties = () => {
        this.vedtaksperiode.id = this.unmapped.id;
        this.vedtaksperiode.gruppeId = this.unmapped.gruppeId;
        this.vedtaksperiode.godkjentAv = this.unmapped.godkjentAv;
        this.vedtaksperiode.godkjenttidspunkt = this.unmapped.godkjenttidspunkt
            ? somKanskjeDato(this.unmapped.godkjenttidspunkt)
            : undefined;
        this.vedtaksperiode.oppgavereferanse = this.unmapped.oppgavereferanse;
        this.vedtaksperiode.utbetalingsreferanse = this.unmapped.utbetalingsreferanse;
        this.vedtaksperiode.kanVelges = true;
    };

    private mapVilkår = () => {
        const { vilkår, problems } = mapVilkår(this.unmapped);
        this.vedtaksperiode.vilkår = vilkår;
        this.problems.push(...problems);
    };

    private mapTilstand = () => {
        this.vedtaksperiode.tilstand =
            (this.inneholderAnnullerteDager() && Vedtaksperiodetilstand.Annullert) ||
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
        this.vedtaksperiode.utbetalingstidslinje = mapUtbetalingstidslinje(this.unmapped.utbetalingstidslinje);
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
                    .map((dag) => dayjs(dag.dato))
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

    private mapInntektskilder = () => {
        this.vedtaksperiode.inntektskilder = [
            {
                organisasjonsnummer: this.arbeidsgiver.organisasjonsnummer,
                månedsinntekt: somInntekt(this.unmapped.inntektFraInntektsmelding),
                årsinntekt: somÅrsinntekt(this.unmapped.inntektFraInntektsmelding),
                refusjon: true,
                forskuttering: true,
            },
        ];
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

    private mapSykepengegrunnlag = () => {
        try {
            this.vedtaksperiode.sykepengegrunnlag = {
                årsinntektFraAording: this.unmapped.dataForVilkårsvurdering?.beregnetÅrsinntektFraInntektskomponenten,
                årsinntektFraInntektsmelding: somÅrsinntekt(this.unmapped.inntektFraInntektsmelding),
                avviksprosent: somProsent(this.unmapped.dataForVilkårsvurdering?.avviksprosent),
                sykepengegrunnlag: this.unmapped.vilkår?.sykepengegrunnlag.sykepengegrunnlag,
            };
        } catch (error) {
            this.vedtaksperiode.sykepengegrunnlag = {};
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
}
