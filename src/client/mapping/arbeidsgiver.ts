import { SpesialistArbeidsgiver, SpesialistInntektsgrunnlag, SpesialistPerson } from 'external-types';
import { Arbeidsgiver, Vedtaksperiode } from 'internal-types';
import dayjs, { Dayjs } from 'dayjs';
import { VedtaksperiodeBuilder } from './vedtaksperiode';
import { sykdomstidslinjedag, utbetalingstidslinjedag } from './dag';
import { nanoid } from 'nanoid';

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
        this.mapUtbetalingshistorikk();
        this.mapArbeidsgiverinfo();
        this.mapVedtaksperioder();
        this.sortVedtaksperioder();
        this.markerNyestePeriode();
        return { arbeidsgiver: this.arbeidsgiver as Arbeidsgiver, problems: this.problems };
    }

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
                this.unmapped.utbetalingshistorikk?.map((element) => ({
                    id: element.id,
                    beregnettidslinje: element.beregnettidslinje.map((dag) => ({
                        dato: dayjs(dag.dagen),
                        type: sykdomstidslinjedag(dag.type),
                    })),
                    hendelsetidslinje: element.hendelsetidslinje.map((dag) => ({
                        dato: dayjs(dag.dagen),
                        type: sykdomstidslinjedag(dag.type),
                    })),
                    utbetalinger: element.utbetalinger.map((utbetaling) => ({
                        status: utbetaling.status,
                        type: utbetaling.type,
                        utbetalingstidslinje: utbetaling.utbetalingstidslinje.map((dag) => ({
                            dato: dayjs(dag.dato),
                            type: utbetalingstidslinjedag(dag.type),
                        })),
                    })),
                })) ?? [],
        };
    };

    private mapVedtaksperioder = () => {
        this.arbeidsgiver.vedtaksperioder = this.unmapped.vedtaksperioder.map((unmappedVedtaksperiode, index) => {
            const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
                .setVedtaksperiode(unmappedVedtaksperiode)
                .setPerson(this.person)
                .setArbeidsgiver(this.unmapped)
                .setOverstyringer(this.unmapped.overstyringer)
                .setInntektsgrunnlag(this.inntektsgrunnlag)
                .build();
            this.problems.push(...problems);
            return vedtaksperiode as Vedtaksperiode;
        });
    };

    private sortVedtaksperioder = () => {
        const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();
        this.arbeidsgiver.vedtaksperioder?.sort(reversert);
    };
}
