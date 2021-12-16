import dayjs, { Dayjs } from 'dayjs';

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

const mapUtbetaling = (
    utbetalinger: ExternalVedtaksperiode['utbetalinger'],
    key: keyof ExternalVedtaksperiode['utbetalinger']
): Utbetaling | undefined =>
    utbetalinger[key] && {
        fagsystemId: utbetalinger[key]!.fagsystemId,
        linjer: utbetalinger[key]!.linjer.map((value: ExternalUtbetalingslinje) => ({
            fom: somDato(value.fom),
            tom: somDato(value.tom),
            dagsats: value.dagsats,
            grad: value.grad,
        })),
    };

const mapExternalUtbetalingV2 = (utbetaling?: ExternalUtbetalingV2): UtbetalingV2 | undefined =>
    utbetaling ? somExternalUtbetalingV2(utbetaling) : undefined;

const mapVurdering = (vurdering?: ExternalVurdering): Vurdering | undefined =>
    vurdering
        ? {
              godkjent: vurdering.godkjent,
              automatisk: vurdering.automatisk,
              ident: vurdering.ident,
              tidsstempel: somTidspunkt(vurdering.tidsstempel),
          }
        : undefined;

const somExternalUtbetalingV2 = (utbetaling: ExternalUtbetalingV2): UtbetalingV2 => {
    return {
        utbetalingId: utbetaling.utbetalingId,
        korrelasjonsId: utbetaling.korrelasjonsId,
        beregningId: utbetaling.beregningId,
        utbetalingstidslinje: utbetaling.utbetalingstidslinje.map((externalLinje: ExternalUtbetalingslinjeV2) => ({
            type: externalLinje.type,
            inntekt: externalLinje.inntekt,
            dato: somDato(externalLinje.dato),
        })),
        status: utbetaling.status,
        type: utbetaling.type,
        maksdato: somDato(utbetaling.maksdato),
        gjenståendeSykedager: utbetaling.gjenståendeSykedager,
        forbrukteSykedager: utbetaling.forbrukteSykedager,
        arbeidsgiverNettoBeløp: utbetaling.arbeidsgiverNettoBeløp,
        personNettoBeløp: utbetaling.personNettoBeløp,
        arbeidsgiverOppdrag: {
            fagsystemId: utbetaling.arbeidsgiverOppdrag.fagsystemId,
            utbetalingslinjer: utbetaling.arbeidsgiverOppdrag.utbetalingslinjer.map(
                (externalLinje: ExternalOppdraglinje) => ({
                    fom: externalLinje.fom,
                    tom: externalLinje.tom,
                    dagsats: externalLinje.dagsats,
                    grad: externalLinje.grad,
                })
            ),
            simuleringsResultat: mapSimuleringsdata(utbetaling.arbeidsgiverOppdrag.simuleringsResultat),
        },
        personOppdrag: {
            fagsystemId: utbetaling.personOppdrag.fagsystemId,
            utbetalingslinjer: utbetaling.personOppdrag.utbetalingslinjer.map(
                (externalLinje: ExternalOppdraglinje) => ({
                    fom: externalLinje.fom,
                    tom: externalLinje.tom,
                    dagsats: externalLinje.dagsats,
                    grad: externalLinje.grad,
                })
            ),
            simuleringsResultat: mapSimuleringsdata(utbetaling.personOppdrag.simuleringsResultat),
        },
        vurdering: mapVurdering(utbetaling.vurdering),
    };
};

export class VedtaksperiodeBuilder {
    private unmapped!: ExternalVedtaksperiode;
    private annullerteHistorikkelementer!: HistorikkElement[];
    private person!: ExternalPerson;
    private arbeidsgiver!: ExternalArbeidsgiver;
    private overstyringer: ExternalOverstyring[] = [];
    private vedtaksperiode: Partial<Vedtaksperiode> = {};
    private inntektsgrunnlag?: ExternalInntektsgrunnlag;
    private problems: Error[] = [];

    setVedtaksperiode = (vedtaksperiode: ExternalVedtaksperiode) => {
        this.unmapped = vedtaksperiode;
        return this;
    };

    setPerson = (person: ExternalPerson) => {
        this.person = person;
        return this;
    };

    setArbeidsgiver = (arbeidsgiver: ExternalArbeidsgiver) => {
        this.arbeidsgiver = arbeidsgiver;
        this.vedtaksperiode.arbeidsgivernavn = arbeidsgiver.navn;
        return this;
    };

    setAnnullertUtbetalingshistorikk = (utbetalingshistorikk: HistorikkElement[]) => {
        this.annullerteHistorikkelementer = utbetalingshistorikk.filter(
            (element) => element.utbetaling.type === 'ANNULLERING'
        );
        return this;
    };

    setOverstyringer = (overstyringer: ExternalOverstyring[]) => {
        this.overstyringer = overstyringer;
        return this;
    };

    setInntektsgrunnlag = (inntektsgrunnlag: ExternalInntektsgrunnlag[]) => {
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
        this.mapPeriodetype();
        this.mapUtbetalinger();
        this.mapUtbetalingV2();
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
        this.vedtaksperiode.erForkastet = this.unmapped.erForkastet ?? false;
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
            (this.inneholderAnnullerteDager() && 'annullert') ||
            (this.venterPåSaksbehandleroppgave() && 'venter') ||
            ((): Periodetilstand => {
                switch (this.unmapped.tilstand) {
                    case 'TilUtbetaling':
                        return 'tilUtbetaling';
                    case 'Utbetalt':
                        return 'utbetalt';
                    case 'Oppgaver':
                        return 'oppgaver';
                    case 'Venter':
                        return 'venter';
                    case 'VenterPåKiling':
                        return 'venterPåKiling';
                    case 'IngenUtbetaling':
                        return 'ingenUtbetaling';
                    case 'Feilet':
                        return 'feilet';
                    case 'TilInfotrygd':
                        return 'tilInfotrygd';
                    default:
                        return 'ukjent';
                }
            })();
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

    private mapUtbetalingV2 = () => {
        this.vedtaksperiode.utbetaling = mapExternalUtbetalingV2(this.unmapped.utbetaling);
    };

    private mapPeriodetype = () => {
        const mapExistingPeriodetype = (): Periodetype => {
            switch (this.unmapped.periodetype) {
                case 'FØRSTEGANGSBEHANDLING':
                    return 'førstegangsbehandling';
                case 'OVERGANG_FRA_IT':
                case 'INFOTRYGDFORLENGELSE':
                    return 'infotrygdforlengelse';
                case 'FORLENGELSE':
                    return 'forlengelse';
                case 'STIKKPRØVE':
                    return 'stikkprøve';
                case 'RISK_QA':
                    return 'riskQa';
            }
        };
        const mapPeriodetype = (): Periodetype => {
            if (this.erFørstegangsbehandling()) {
                return 'førstegangsbehandling';
            } else if (this.erInfotrygdforlengelse()) {
                return 'infotrygdforlengelse';
            } else {
                return 'forlengelse';
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
        const tidslinjeoverstyringer = this.overstyringer.filter(
            (it: ExternalOverstyring) =>
                it.type === 'Dager' &&
                (it as ExternalTidslinjeoverstyring).overstyrteDager
                    ?.map((dag) => dayjs(dag.dato))
                    .every(
                        (dato) =>
                            this.vedtaksperiode.fom?.isSameOrBefore(dato) &&
                            this.vedtaksperiode.tom?.isSameOrAfter(dato)
                    )
        ) as ExternalTidslinjeoverstyring[];
        this.vedtaksperiode.overstyringer = tidslinjeoverstyringer
            .map((overstyring: ExternalTidslinjeoverstyring) => ({
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
        const arbeidsgiverForOrganisasjonsnummer = (organisasjonsnummer: string): ExternalArbeidsgiver | undefined =>
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
                            kilde: arbeidsgiverinntekt.omregnetÅrsinntekt.kilde,
                            inntekterFraAOrdningen:
                                arbeidsgiverinntekt.omregnetÅrsinntekt.inntekterFraAOrdningen !== null
                                    ? this.sorterInntekterFraAOrdningen(
                                          arbeidsgiverinntekt.omregnetÅrsinntekt.inntekterFraAOrdningen
                                      )
                                    : undefined,
                        }) ??
                        undefined,
                    sammenligningsgrunnlag:
                        (arbeidsgiverinntekt.sammenligningsgrunnlag && {
                            ...arbeidsgiverinntekt.sammenligningsgrunnlag,
                            inntekterFraAOrdningen: this.sorterInntekterFraAOrdningen(
                                arbeidsgiverinntekt.sammenligningsgrunnlag.inntekterFraAOrdningen
                            ),
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
            this.problems.push(error as Error);
        }
    };

    private sorterInntekterFraAOrdningen = (
        inntekterFraAOrdningen: ExternalInntekterFraAOrdningen[]
    ): ExternalInntekterFraAOrdningen[] =>
        inntekterFraAOrdningen
            .map((inntektFraAOrdningen) => ({
                måned: dayjs(inntektFraAOrdningen.måned, 'YYYY-MM'),
                sum: inntektFraAOrdningen.sum,
            }))
            .sort((a, b) => (a.måned.isAfter(b.måned) ? -1 : 1))
            .map((it) => ({
                måned: it.måned.format('YYYY-MM'),
                sum: it.sum,
            }));

    private erInfotrygdforlengelse = (): boolean => this.unmapped.forlengelseFraInfotrygd === 'JA';

    private erFørstegangsbehandling = (): boolean => {
        const førsteUtbetalingsdag = this.unmapped.utbetalinger?.arbeidsgiverUtbetaling?.linjer[0].fom ?? dayjs(0);
        return this.unmapped.utbetalingstidslinje.some((dag) => dayjs(dag.dato).isSame(førsteUtbetalingsdag));
    };

    private inneholderAnnullerteDager = (): boolean =>
        !!this.unmapped.sykdomstidslinje.find((dag) => dag.type === 'ANNULLERT_DAG');

    private venterPåSaksbehandleroppgave = (): boolean =>
        this.unmapped.tilstand === 'Oppgaver' && this.unmapped.oppgavereferanse === null;
}
