import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

import {
    sykdomstidslinje,
    utbetalingshistorikkelement,
    utbetalingstidslinje,
} from '../modell/utbetalingshistorikkelement';

import { mapSykdomstidslinje, mapTidslinjeMedAldersvilkår, mapUtbetalingstidslinje } from './dag';
import { UfullstendigVedtaksperiodeBuilder } from './ufullstendigVedtaksperiode';
import { VedtaksperiodeBuilder } from './vedtaksperiode';

const SKAL_IKKE_KOPIERES = false;

const erAnnullering = (periode: TidslinjeperiodeMedSykefravær) => periode.type === 'ANNULLERT_PERIODE';
const erRevurdering = (periode: TidslinjeperiodeMedSykefravær) => periode.type === 'REVURDERING';

const periodeHarNyereGenerasjon = (id: string, nesteGenerasjon: TidslinjeperiodeMedSykefravær[]) =>
    nesteGenerasjon.flatMap((periode) => periode.id).includes(id);

const nesteGenerasjonHarAnnullering = (nesteGenerasjon: TidslinjeperiodeMedSykefravær[], fagsystemId?: string) =>
    nesteGenerasjon.find((periode) => erAnnullering(periode) && periode.fagsystemId === fagsystemId);

const tidligerePeriodeINesteGenerasjonErRevurdering = (
    nesteGenerasjon: TidslinjeperiodeMedSykefravær[],
    gjeldende: TidslinjeperiodeMedSykefravær
) => nesteGenerasjon.find((periode) => erRevurdering(periode) && periode.fom.isBefore(gjeldende.fom)) !== undefined;

export class ArbeidsgiverBuilder {
    private unmapped!: ExternalArbeidsgiver;
    private person!: ExternalPerson;
    private arbeidsgiver: Partial<Arbeidsgiver> = {};
    private inntektsgrunnlag!: ExternalInntektsgrunnlag[];
    private problems: Error[] = [];

    addPerson(person: ExternalPerson) {
        this.person = person;
        return this;
    }

    addArbeidsgiver(arbeidsgiver: ExternalArbeidsgiver) {
        this.unmapped = arbeidsgiver;
        return this;
    }

    addInntektsgrunnlag(inntektsgrunnlag: ExternalInntektsgrunnlag[]) {
        this.inntektsgrunnlag = inntektsgrunnlag;
        return this;
    }

    build(): { arbeidsgiver?: Arbeidsgiver; problems: Error[] } {
        if (!this.unmapped) {
            this.problems.push(Error('Mangler arbeidsgiverdata å mappe'));
            return { problems: this.problems };
        }
        this.mapArbeidsgiverinfo();
        this.mapArbeidsforhold();
        this.mapUtbetalingshistorikk();
        this.mapVedtaksperioder();
        this.sortVedtaksperioder();
        this.markerNyestePeriode();
        this.mapTidslinjeperioderMedSykefravær();
        this.mapTidslinjeperioderUtenSykefravær();
        return { arbeidsgiver: this.arbeidsgiver as Arbeidsgiver, problems: this.problems };
    }

    private mapTidslinjeperioderMedSykefravær = () => {
        this.arbeidsgiver.tidslinjeperioder = this.flatten(
            this.arbeidsgiver.vedtaksperioder?.flatMap(
                (periode): TidslinjeperiodeMedSykefravær[] =>
                    periode.beregningIder?.map((beregningId) =>
                        this.mapFullstendigPeriode(beregningId, periode as Vedtaksperiode)
                    ) ?? this.mapUfullstendigPeriode(periode)
            ) ?? []
        );
    };

    private mapTidslinjeperioderUtenSykefravær = () => {
        this.arbeidsgiver.tidslinjeperioderUtenSykefravær =
            this.unmapped.ghostPerioder?.map(
                (ghostpølse) =>
                    ({
                        id: nanoid(),
                        fom: dayjs(ghostpølse.fom),
                        tom: dayjs(ghostpølse.tom),
                        tilstand: 'utenSykefravær',
                        organisasjonsnummer: this.arbeidsgiver.organisasjonsnummer,
                        skjæringstidspunkt: ghostpølse.skjæringstidspunkt,
                        inntektskilde: 'FLERE_ARBEIDSGIVERE',
                        vilkårsgrunnlaghistorikkId: ghostpølse.vilkårsgrunnlagHistorikkInnslagId,
                        fullstendig: true,
                    } as TidslinjeperiodeUtenSykefravær)
            ) ?? [];
    };

    private mapFullstendigPeriode = (beregningId: string, periode: Vedtaksperiode): TidslinjeperiodeMedSykefravær => {
        const element = this.arbeidsgiver.utbetalingshistorikk?.find((e) => e.id === beregningId)!;
        const tidslinje = mapTidslinjeMedAldersvilkår(
            utbetalingstidslinje(element.utbetaling, periode.fom, periode.tom),
            (periode as Vedtaksperiode)?.vilkår?.alder
        );
        const periodetype = (): TidslinjeperiodeMedSykefravær['type'] => {
            switch (element.utbetaling.type) {
                case 'UTBETALING':
                    return 'VEDTAKSPERIODE';
                case 'REVURDERING':
                    return 'REVURDERING';
                case 'ANNULLERING':
                    return 'ANNULLERT_PERIODE';
                default:
                    return 'UFULLSTENDIG';
            }
        };
        const oppgavereferanse = (periode as Vedtaksperiode).oppgavereferanse;
        const harOppgave = !!oppgavereferanse;
        return {
            id: periode.id,
            beregningId: beregningId,
            unique: nanoid(),
            fagsystemId: element.utbetaling.arbeidsgiverFagsystemId,
            fom: periode.fom,
            tom: periode.tom,
            type: periodetype(),
            inntektskilde: (periode as Vedtaksperiode).inntektskilde,
            tilstand: this.tilstand(
                element.utbetaling.status,
                periodetype(),
                tidslinje,
                harOppgave,
                element.utbetaling.vurdering
            ),
            utbetalingstidslinje: tidslinje,
            sykdomstidslinje: sykdomstidslinje(element.beregnettidslinje, periode.fom, periode.tom),
            fullstendig: periode.fullstendig,
            organisasjonsnummer: this.arbeidsgiver.organisasjonsnummer!,
            opprettet: element.tidsstempel,
            oppgavereferanse: oppgavereferanse,
            skjæringstidspunkt: periode.vilkår?.dagerIgjen.skjæringstidspunkt.format('YYYY-MM-DD') ?? null,
            vilkårsgrunnlaghistorikkId: element.vilkårsgrunnlaghistorikkId,
        };
    };

    private mapUfullstendigPeriode = (periode: UfullstendigVedtaksperiode): TidslinjeperiodeMedSykefravær[] => [
        {
            id: periode.id,
            beregningId: nanoid(),
            unique: nanoid(),
            fom: periode.fom,
            tom: periode.tom,
            type: 'UFULLSTENDIG',
            inntektskilde: 'UKJENT',
            tilstand: this.tilstand(
                'UKJENT',
                'UFULLSTENDIG',
                periode.utbetalingstidslinje,
                false,
                undefined,
                periode.tilstand
            ),
            utbetalingstidslinje: [],
            sykdomstidslinje: [],
            fullstendig: periode.fullstendig,
            organisasjonsnummer: this.arbeidsgiver.organisasjonsnummer!,
            opprettet: dayjs(),
            vilkårsgrunnlaghistorikkId: null,
            skjæringstidspunkt: null,
        },
    ];

    private mapArbeidsforhold = () => {
        this.arbeidsgiver = {
            ...this.arbeidsgiver,
            arbeidsforhold:
                this.person?.arbeidsforhold
                    ?.filter((it) => it.organisasjonsnummer === this.arbeidsgiver.organisasjonsnummer)
                    .map((it) => ({
                        stillingstittel: it.stillingstittel,
                        stillingsprosent: it.stillingsprosent,
                        startdato: dayjs(it.startdato),
                        sluttdato: it.sluttdato ? dayjs(it.sluttdato) : undefined,
                    })) ?? [],
        };
    };

    private markerNyestePeriode() {
        if (this.arbeidsgiver.vedtaksperioder?.length ?? -1 > 0) {
            this.arbeidsgiver.vedtaksperioder![0].erNyeste = true;
        }
    }

    private mapArbeidsgiverinfo = () => {
        this.arbeidsgiver = {
            ...this.arbeidsgiver,
            navn: this.unmapped.navn,
            id: this.unmapped.id,
            organisasjonsnummer: this.unmapped.organisasjonsnummer,
        };
    };

    private mapUtbetalingshistorikk = () => {
        this.arbeidsgiver = {
            ...this.arbeidsgiver,
            utbetalingshistorikk:
                this.unmapped.utbetalingshistorikk?.map((element: ExternalHistorikkElement) => {
                    return utbetalingshistorikkelement(
                        element.beregningId,
                        element.vilkårsgrunnlagHistorikkId,
                        mapSykdomstidslinje(element.beregnettidslinje),
                        mapSykdomstidslinje(element.hendelsetidslinje),
                        {
                            status: this.utbetalingsstatus(element.utbetaling.status),
                            type: this.utbetalingstype(element.utbetaling.type),
                            utbetalingstidslinje: mapUtbetalingstidslinje(element.utbetaling.utbetalingstidslinje),
                            maksdato: dayjs(element.utbetaling.maksdato),
                            gjenståendeDager: element.utbetaling.gjenståendeSykedager,
                            arbeidsgiverNettobeløp: element.utbetaling.arbeidsgiverNettoBeløp,
                            personNettobeløp: element.utbetaling.personNettoBeløp,
                            arbeidsgiverFagsystemId: element.utbetaling.arbeidsgiverFagsystemId,
                            personFagsystemId: element.utbetaling.personFagsystemId,
                            forbrukteDager: element.utbetaling.forbrukteSykedager,
                            vurdering: element.utbetaling.vurdering
                                ? {
                                      godkjent: element.utbetaling.vurdering.godkjent,
                                      tidsstempel: dayjs(element.utbetaling.vurdering.tidsstempel),
                                      automatisk: element.utbetaling.vurdering.automatisk,
                                      ident: element.utbetaling.vurdering.ident,
                                  }
                                : undefined,
                        },
                        dayjs(element.tidsstempel)
                    );
                }) ?? [],
        };
    };

    private mapVedtaksperioder = () => {
        this.arbeidsgiver.vedtaksperioder = this.unmapped.vedtaksperioder.map((unmappedVedtaksperiode) => {
            if (unmappedVedtaksperiode.fullstendig) {
                const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
                    .setVedtaksperiode(unmappedVedtaksperiode as ExternalVedtaksperiode)
                    .setPerson(this.person)
                    .setArbeidsgiver(this.unmapped)
                    .setAnnullertUtbetalingshistorikk(this.arbeidsgiver.utbetalingshistorikk!)
                    .setOverstyringer(this.unmapped.overstyringer)
                    .setInntektsgrunnlag(this.inntektsgrunnlag)
                    .build();
                this.problems.push(...problems);
                return vedtaksperiode as Vedtaksperiode;
            } else {
                const { ufullstendigVedtaksperiode, problems } = new UfullstendigVedtaksperiodeBuilder(
                    this.person,
                    this.unmapped,
                    unmappedVedtaksperiode
                ).build();
                this.problems.push(...problems);
                return ufullstendigVedtaksperiode as UfullstendigVedtaksperiode;
            }
        });
    };

    private sortVedtaksperioder = () => {
        const reversert = (
            a: Vedtaksperiode | UfullstendigVedtaksperiode,
            b: Vedtaksperiode | UfullstendigVedtaksperiode
        ) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();
        this.arbeidsgiver.vedtaksperioder?.sort(reversert);
    };

    private flatten = (perioder: TidslinjeperiodeMedSykefravær[]) => {
        const result = [...perioder]
            .sort((a, b) => (b.opprettet.isBefore(a.opprettet) ? 1 : -1))
            .map((periode) => [periode])
            .filter((generasjon) => this.ufullstendigePerioder(generasjon).length === 0)
            .filter((generasjon, index, alle) => {
                if (index === alle.length - 1) return true;
                const perioderSomSkalKopieres = this.perioderSomIkkeHarNyereGenerasjon(
                    generasjon,
                    index,
                    alle[index + 1]
                );
                alle[index + 1] = this.kopierTilNesteGenerasjon(alle[index + 1], perioderSomSkalKopieres);
                return perioderSomSkalKopieres.length !== generasjon.length;
            })
            .reverse()
            .map((generasjon, index) => this.leggUfullstendigePerioderPåSisteGenerasjon(generasjon, index, perioder));

        const fikkInputMenProduserteIngenOutput = perioder.length > 0 && result.length === 0;
        return fikkInputMenProduserteIngenOutput ? [perioder] : result;
    };

    private utbetalingstype = (type: string): UtbetalingshistorikkElement['type'] => {
        switch (type.toUpperCase()) {
            case 'UTBETALING':
                return 'UTBETALING';
            case 'ANNULLERING':
                return 'ANNULLERING';
            case 'ETTERUTBETALING':
                return 'ETTERUTBETALING';
            case 'REVURDERING':
                return 'REVURDERING';
            default:
                return 'UKJENT';
        }
    };

    private utbetalingsstatus = (type: string): UtbetalingshistorikkElement['status'] => {
        switch (type.toUpperCase()) {
            case 'IKKE_UTBETALT':
                return 'IKKE_UTBETALT';
            case 'IKKE_GODKJENT':
                return 'IKKE_GODKJENT';
            case 'GODKJENT':
                return 'GODKJENT';
            case 'SENDT':
                return 'SENDT';
            case 'OVERFØRT':
                return 'OVERFØRT';
            case 'UTBETALT':
                return 'UTBETALT';
            case 'GODKJENT_UTEN_UTBETALING':
                return 'GODKJENT_UTEN_UTBETALING';
            case 'UTBETALING_FEILET':
                return 'UTBETALING_FEILET';
            case 'ANNULLERT':
                return 'ANNULLERT';
            default:
                return 'UKJENT';
        }
    };

    private perioderSomIkkeHarNyereGenerasjon = (
        generasjon: TidslinjeperiodeMedSykefravær[],
        index: number,
        nesteGenerasjon: TidslinjeperiodeMedSykefravær[]
    ): TidslinjeperiodeMedSykefravær[] =>
        generasjon
            .filter((periode) => {
                if (!erAnnullering(periode) && nesteGenerasjonHarAnnullering(nesteGenerasjon, periode.fagsystemId))
                    return SKAL_IKKE_KOPIERES;
                if (tidligerePeriodeINesteGenerasjonErRevurdering(nesteGenerasjon, periode)) return SKAL_IKKE_KOPIERES;
                return !periodeHarNyereGenerasjon(periode.id, nesteGenerasjon);
            })
            .map((periode) => ({
                ...periode,
                unique: nanoid(),
            }));

    private leggUfullstendigePerioderPåSisteGenerasjon = (
        generasjon: TidslinjeperiodeMedSykefravær[],
        index: number,
        allePerioder: TidslinjeperiodeMedSykefravær[]
    ) => {
        if (index === 0) {
            return [...generasjon, ...this.alleUfullstendigePerioder(allePerioder)];
        }
        return generasjon;
    };

    private alleUfullstendigePerioder = (alleGenerasjoner: TidslinjeperiodeMedSykefravær[]) =>
        alleGenerasjoner.filter((periode) => !periode.fullstendig);

    private ufullstendigePerioder = (generasjon: TidslinjeperiodeMedSykefravær[]) =>
        generasjon.filter((periode) => !periode.fullstendig);

    private kopierTilNesteGenerasjon = (
        nesteGenerasjon: TidslinjeperiodeMedSykefravær[],
        perioderSomSkalKopieres: TidslinjeperiodeMedSykefravær[]
    ) => [...nesteGenerasjon, ...perioderSomSkalKopieres];

    private tilstand = (
        utbetalingstatus: UtbetalingshistorikkElement['status'],
        periodetype: TidslinjeperiodeMedSykefravær['type'],
        utbetalingstidslinje: Utbetalingsdag[],
        harOppgave: boolean,
        vurdering?: UtbetalingshistorikkElement['vurdering'],
        vedtaksperiodetilstand?: Periodetilstand
    ): Tidslinjetilstand => {
        switch (periodetype) {
            case 'VEDTAKSPERIODE':
                switch (utbetalingstatus) {
                    case 'IKKE_UTBETALT':
                        return harOppgave ? 'oppgaver' : 'venter';
                    case 'IKKE_GODKJENT':
                        return 'avslag';
                    case 'GODKJENT':
                    case 'SENDT':
                    case 'OVERFØRT':
                        return vurdering?.automatisk ? 'tilUtbetalingAutomatisk' : 'tilUtbetaling';
                    case 'UTBETALT':
                        return vurdering?.automatisk ? 'utbetaltAutomatisk' : 'utbetalt';
                    default:
                        return this.defaultTidslinjeTilstander(utbetalingstatus, utbetalingstidslinje);
                }
            case 'REVURDERING':
                switch (utbetalingstatus) {
                    case 'IKKE_UTBETALT':
                        return 'revurderes';
                    case 'IKKE_GODKJENT':
                        return 'avslag';
                    case 'GODKJENT':
                    case 'SENDT':
                    case 'OVERFØRT':
                    case 'UTBETALT':
                    case 'GODKJENT_UTEN_UTBETALING':
                        return this.harDagtype('Syk', utbetalingstidslinje) ? 'revurdert' : 'revurdertIngenUtbetaling';
                    case 'UTBETALING_FEILET':
                        return 'revurderingFeilet';
                    default:
                        return this.defaultTidslinjeTilstander(utbetalingstatus, utbetalingstidslinje);
                }
            case 'ANNULLERT_PERIODE':
                switch (utbetalingstatus) {
                    case 'GODKJENT':
                    case 'SENDT':
                    case 'OVERFØRT':
                        return 'tilAnnullering';
                    case 'ANNULLERT':
                        return 'annullert';
                    case 'UTBETALING_FEILET':
                        return 'annulleringFeilet';
                    default:
                        return this.defaultTidslinjeTilstander(utbetalingstatus, utbetalingstidslinje);
                }
            case 'UFULLSTENDIG':
                switch (vedtaksperiodetilstand) {
                    case 'ingenUtbetaling':
                        return vedtaksperiodetilstand;
                    default:
                        return utbetalingstidslinje.length === 0 ||
                            vedtaksperiodetilstand === 'venter' ||
                            vedtaksperiodetilstand === 'venterPåKiling'
                            ? 'venter'
                            : this.defaultTidslinjeTilstander('GODKJENT_UTEN_UTBETALING', utbetalingstidslinje);
                }
        }
    };

    private defaultTidslinjeTilstander = (
        utbetalingstatus: UtbetalingshistorikkElement['status'],
        utbetalingstidslinje: Utbetalingsdag[]
    ): Tidslinjetilstand => {
        switch (utbetalingstatus) {
            case 'GODKJENT_UTEN_UTBETALING':
                return this.harUtelukkende(['Ferie', 'Helg'], utbetalingstidslinje)
                    ? 'kunFerie'
                    : this.harUtelukkende(['Permisjon', 'Helg'], utbetalingstidslinje)
                    ? 'kunPermisjon'
                    : 'ingenUtbetaling';
            case 'UTBETALING_FEILET':
                return 'feilet';
            default:
                return 'ukjent';
        }
    };

    private harUtelukkende = (dagtyper: Dag['type'][], utbetalingstidslinje: Utbetalingsdag[]) =>
        utbetalingstidslinje.filter((dag) => dagtyper.includes(dag.type)).length === utbetalingstidslinje.length;

    private harDagtype = (dagtype: Dag['type'], utbetalingstidslinje: Utbetalingsdag[]) =>
        utbetalingstidslinje.filter((dag) => dag.type.includes(dagtype)).length > 0;
}
