import dayjs from 'dayjs';
import {
    EksternUtbetalingshistorikkElement,
    SpesialistArbeidsgiver,
    SpesialistInntektsgrunnlag,
    SpesialistPerson,
    SpesialistVedtaksperiode,
} from 'external-types';
import { Arbeidsgiver, UfullstendigVedtaksperiode, Utbetalingstype, Vedtaksperiode } from 'internal-types';
import { nanoid } from 'nanoid';

import {
    Periodetype,
    sykdomstidslinje,
    Tidslinjeperiode,
    utbetalingshistorikkelement,
    Utbetalingstatus,
    utbetalingstidslinje,
} from '../modell/UtbetalingshistorikkElement';

import { sykdomstidslinjedag, utbetalingstidslinjedag } from './dag';
import { UfullstendigVedtaksperiodeBuilder } from './ufullstendigVedtaksperiode';
import { VedtaksperiodeBuilder } from './vedtaksperiode';

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
        this.mapVedtaksperioder();
        this.sortVedtaksperioder();
        this.markerNyestePeriode();
        this.mapUtbetalingshistorikk();
        this.mapTidslinjeperioder();
        return { arbeidsgiver: this.arbeidsgiver as Arbeidsgiver, problems: this.problems };
    }

    private mapTidslinjeperioder = () => {
        this.arbeidsgiver = {
            ...this.arbeidsgiver,
            tidslinjeperioder: this.flatten(
                this.arbeidsgiver.vedtaksperioder?.flatMap((periode) => {
                    return (
                        periode.beregningIder?.map((beregningId) => {
                            const element = this.arbeidsgiver.utbetalingshistorikk?.find((e) => e.id === beregningId)!;
                            const sisteUtbetaling = element.utbetalinger[element.utbetalinger.length - 1];
                            return {
                                id: periode.id,
                                beregningId: beregningId,
                                unique: nanoid(),
                                fom: periode.fom,
                                tom: periode.tom,
                                type:
                                    sisteUtbetaling.type === Utbetalingstype.UTBETALING
                                        ? Periodetype.VEDTAKSPERIODE
                                        : Periodetype.REVURDERING,
                                tilstand: sisteUtbetaling.status,
                                utbetalingstidslinje: utbetalingstidslinje(sisteUtbetaling, periode.fom, periode.tom),
                                sykdomstidslinje: sykdomstidslinje(element.beregnettidslinje, periode.fom, periode.tom),
                                fullstendig: periode.fullstendig,
                                organisasjonsnummer: this.arbeidsgiver.organisasjonsnummer!,
                            };
                        }) ?? [
                            {
                                id: periode.id,
                                beregningId: nanoid(),
                                unique: nanoid(),
                                fom: periode.fom,
                                tom: periode.tom,
                                type: Periodetype.VEDTAKSPERIODE,
                                tilstand: Utbetalingstatus.UKJENT,
                                utbetalingstidslinje: [],
                                sykdomstidslinje: [],
                                fullstendig: periode.fullstendig,
                                organisasjonsnummer: this.arbeidsgiver.organisasjonsnummer!,
                            },
                        ]
                    );
                }) ?? []
            ),
        };
    };

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
                this.unmapped.utbetalingshistorikk
                    ?.filter((it) => {
                        return this.arbeidsgiver.vedtaksperioder?.some((periode) =>
                            periode.beregningIder?.includes(it.beregningId)
                        );
                    })
                    .map((element: EksternUtbetalingshistorikkElement) => {
                        return utbetalingshistorikkelement(
                            element.beregningId,
                            element.beregnettidslinje.map((dag) => ({
                                dato: dayjs(dag.dagen),
                                type: sykdomstidslinjedag(dag.type),
                            })),
                            element.hendelsetidslinje.map((dag) => ({
                                dato: dayjs(dag.dagen),
                                type: sykdomstidslinjedag(dag.type),
                            })),
                            {
                                status: this.utbetalingsstatus(element.utbetaling.status),
                                type: this.utbetalingstype(element.utbetaling.type),
                                utbetalingstidslinje: element.utbetaling.utbetalingstidslinje.map((dag) => ({
                                    dato: dayjs(dag.dato),
                                    type: utbetalingstidslinjedag(dag.type),
                                })),
                                maksdato: dayjs(element.utbetaling.maksdato),
                                gjenståendeDager: element.utbetaling.gjenståendeSykedager,
                                nettobeløp: element.utbetaling.arbeidsgiverNettoBeløp,
                                forbrukteDager: element.utbetaling.forbrukteSykedager,
                                arbeidsgiverFagsystemId: element.utbetaling.arbeidsgiverFagsystemId,
                                vurdering: element.utbetaling.vurdering
                                    ? {
                                          godkjent: element.utbetaling.vurdering.godkjent,
                                          tidsstempel: dayjs(element.utbetaling.vurdering.tidsstempel),
                                          automatisk: element.utbetaling.vurdering.automatisk,
                                          ident: element.utbetaling.vurdering.ident,
                                      }
                                    : undefined,
                            });
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

    private utbetalingstype = (type: string): Utbetalingstype => {
        switch (type.toUpperCase()) {
            case 'UTBETALING':
                return Utbetalingstype.UTBETALING;
            case 'ANNULLERING':
                return Utbetalingstype.ANNULLERING;
            case 'ETTERUTBETALING':
                return Utbetalingstype.ETTERUTBETALING;
            case 'REVURDERING':
                return Utbetalingstype.REVURDERING;
            default:
                return Utbetalingstype.UKJENT;
        }
    };

    private utbetalingsstatus = (type: string): Utbetalingstatus => {
        switch (type.toUpperCase()) {
            case 'IKKE_UTBETALT':
                return Utbetalingstatus.IKKE_UTBETALT;
            case 'UTBETALT':
                return Utbetalingstatus.UTBETALT;
            case 'INGEN_UTBETALING':
                return Utbetalingstatus.INGEN_UTBETALING;
            case 'UKJENT':
                return Utbetalingstatus.UKJENT;
            default:
                return Utbetalingstatus.UKJENT;
        }
    };

    private flatten = (perioder: Tidslinjeperiode[]) =>
        perioder
            .map((periode) => [periode])
            .reverse()
            .filter((generasjon, index, alle) => {
                if (index === alle.length - 1) return true;
                const perioderSomSkalKopieres = generasjon
                    .filter((periode) => !alle[index + 1].flatMap((periode) => periode.id).includes(periode.id))
                    .map((periode) => ({
                        ...periode,
                        unique: nanoid(),
                    }));
                alle[index + 1] = [...alle[index + 1], ...perioderSomSkalKopieres];
                return perioderSomSkalKopieres.length !== generasjon.length;
            });
}
