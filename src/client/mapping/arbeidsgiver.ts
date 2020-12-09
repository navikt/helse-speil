import { SpesialistArbeidsgiver, SpesialistInntektsgrunnlag } from 'external-types';
import { Arbeidsgiver, Vedtaksperiode } from 'internal-types';
import dayjs from 'dayjs';
import { VedtaksperiodeBuilder } from './vedtaksperiode';

export class ArbeidsgiverBuilder {
    private unmapped: SpesialistArbeidsgiver;
    private arbeidsgiver: Partial<Arbeidsgiver> = {};
    private inntektsgrunnlag: SpesialistInntektsgrunnlag[];
    private problems: Error[] = [];

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
        this.mapVedtaksperioder();
        this.sortVedtaksperioder();
        return { arbeidsgiver: this.arbeidsgiver as Arbeidsgiver, problems: this.problems };
    }

    private mapArbeidsgiverinfo = () => {
        this.arbeidsgiver = {
            ...this.arbeidsgiver,
            navn: this.unmapped.navn,
            id: this.unmapped.id,
            organisasjonsnummer: this.unmapped.organisasjonsnummer,
        };
    };

    private mapVedtaksperioder = () => {
        this.arbeidsgiver.vedtaksperioder = this.unmapped.vedtaksperioder.map((unmappedVedtaksperiode) => {
            const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
                .setVedtaksperiode(unmappedVedtaksperiode)
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
        this.arbeidsgiver.vedtaksperioder = this.arbeidsgiver.vedtaksperioder?.sort(reversert);
    };
}
