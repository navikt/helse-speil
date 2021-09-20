import dayjs from 'dayjs';
import {
    EksternUtbetalingshistorikkElement,
    SpesialistArbeidsgiver,
    SpesialistInntektsgrunnlag,
    SpesialistPerson,
    SpesialistVedtaksperiode,
} from 'external-types';
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

const erAnnullering = (periode: Tidslinjeperiode) => periode.type === 'ANNULLERT_PERIODE';
const erRevurdering = (periode: Tidslinjeperiode) => periode.type === 'REVURDERING';

const periodeHarNyereGenerasjon = (id: string, nesteGenerasjon: Tidslinjeperiode[]) =>
    nesteGenerasjon.flatMap((periode) => periode.id).includes(id);

const nesteGenerasjonHarAnnullering = (nesteGenerasjon: Tidslinjeperiode[], fagsystemId?: string) =>
    nesteGenerasjon.find((periode) => erAnnullering(periode) && periode.fagsystemId === fagsystemId);

const tidligerePeriodeINesteGenerasjonErRevurdering = (
    nesteGenerasjon: Tidslinjeperiode[],
    gjeldende: Tidslinjeperiode
) => nesteGenerasjon.find((periode) => erRevurdering(periode) && periode.fom.isBefore(gjeldende.fom)) !== undefined;

export class ArbeidsgiverBuilder {
    private unmapped: SpesialistArbeidsgiver;
    private person: SpesialistPerson;
    private arbeidsgiver: Partial<Arbeidsgiver> = {};
    private inntektsgrunnlag: SpesialistInntektsgrunnlag[];
    private problems: Error[] = [];

    addPerson(person: SpesialistPerson) {
        this.person = person;
        return this;
    }

    addArbeidsgiver(arbeidsgiver: SpesialistArbeidsgiver) {
        this.unmapped = arbeidsgiver;
        return this;
    }

    addInntektsgrunnlag(inntektsgrunnlag: SpesialistInntektsgrunnlag[]) {
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
        this.mapTidslinjeperioder();
        return { arbeidsgiver: this.arbeidsgiver as Arbeidsgiver, problems: this.problems };
    }

    private mapTidslinjeperioder = () => {
        this.arbeidsgiver.tidslinjeperioder = this.flatten(
            this.arbeidsgiver.vedtaksperioder?.flatMap(
                (periode): Tidslinjeperiode[] =>
                    periode.beregningIder?.map((beregningId) => this.mapBeregningId(beregningId, periode)) ??
                    this.mapUfullstendigPeriode(periode)
            ) ?? []
        );
    };

    private mapBeregningId = (
        beregningId: string,
        periode: Vedtaksperiode | UfullstendigVedtaksperiode
    ): Tidslinjeperiode => {
        const element = this.arbeidsgiver.utbetalingshistorikk?.find((e) => e.id === beregningId)!;
        const tidslinje = mapTidslinjeMedAldersvilkår(
            utbetalingstidslinje(element.utbetaling, periode.fom, periode.tom),
            (periode as Vedtaksperiode)?.vilkår?.alder
        );
        const periodetype = (): Tidslinjeperiode['type'] => {
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
        };
    };

    private mapUfullstendigPeriode = (periode: UfullstendigVedtaksperiode): Tidslinjeperiode[] => [
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
                this.unmapped.utbetalingshistorikk?.map((element: EksternUtbetalingshistorikkElement) => {
                    return utbetalingshistorikkelement(
                        element.beregningId,
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
                    .setVedtaksperiode(unmappedVedtaksperiode as SpesialistVedtaksperiode)
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
        const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();
        this.arbeidsgiver.vedtaksperioder?.sort(reversert);
    };

    private flatten = (perioder: Tidslinjeperiode[]) => {
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
        generasjon: Tidslinjeperiode[],
        index: number,
        nesteGenerasjon: Tidslinjeperiode[]
    ): Tidslinjeperiode[] =>
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
        generasjon: Tidslinjeperiode[],
        index: number,
        allePerioder: Tidslinjeperiode[]
    ) => {
        if (index === 0) {
            return [...generasjon, ...this.alleUfullstendigePerioder(allePerioder)];
        }
        return generasjon;
    };

    private alleUfullstendigePerioder = (alleGenerasjoner: Tidslinjeperiode[]) =>
        alleGenerasjoner.filter((periode) => !periode.fullstendig);

    private ufullstendigePerioder = (generasjon: Tidslinjeperiode[]) =>
        generasjon.filter((periode) => !periode.fullstendig);

    private kopierTilNesteGenerasjon = (
        nesteGenerasjon: Tidslinjeperiode[],
        perioderSomSkalKopieres: Tidslinjeperiode[]
    ) => [...nesteGenerasjon, ...perioderSomSkalKopieres];

    private tilstand = (
        utbetalingstatus: UtbetalingshistorikkElement['status'],
        periodetype: Tidslinjeperiode['type'],
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
                return utbetalingstidslinje.length === 0 ||
                    vedtaksperiodetilstand === 'venter' ||
                    vedtaksperiodetilstand === 'venterPåKiling'
                    ? 'venter'
                    : this.defaultTidslinjeTilstander('GODKJENT_UTEN_UTBETALING', utbetalingstidslinje);
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
