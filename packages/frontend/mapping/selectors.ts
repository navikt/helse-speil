import dayjs, { Dayjs } from 'dayjs';
import { useVilkårsgrunnlaghistorikk } from '../state/person';

const trimLedendeArbeidsdager = (sykdomstidslinje: Dag[]): Dag[] => {
    const førsteIkkearbeidsdag = sykdomstidslinje.findIndex((dag) => dag.type !== 'Arbeidsdag') ?? 0;
    return sykdomstidslinje.slice(førsteIkkearbeidsdag);
};

const byTidligsteVedtaksperiode = (a: Vedtaksperiode, b: Vedtaksperiode): number => {
    const aSykdomsdager = trimLedendeArbeidsdager(a.sykdomstidslinje);
    const bSykdomsdager = trimLedendeArbeidsdager(b.sykdomstidslinje);
    return aSykdomsdager[0].dato.isAfter(bSykdomsdager[0].dato) ? 1 : -1;
};

export const førsteVedtaksperiode = (nåværendePeriode: Vedtaksperiode, person: Person): Vedtaksperiode =>
    person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.vedtaksperioder)
        .filter((periode) => periode.fullstendig)
        .map((periode) => periode as Vedtaksperiode)
        .filter((periode) => periode.gruppeId === nåværendePeriode.gruppeId)
        .sort(byTidligsteVedtaksperiode)[0];

export const organisasjonsnummerForPeriode = (nåværendePeriode: Vedtaksperiode, person: Person): string =>
    person.arbeidsgivere.find(({ vedtaksperioder }) => vedtaksperioder.find(({ id }) => id === nåværendePeriode.id))!
        .organisasjonsnummer;

export const maksdatoForPeriode = ({ vilkår }: Vedtaksperiode): Dayjs | undefined => vilkår?.dagerIgjen.maksdato;

export const maksdatoForPerson = (person: Person): Dayjs | undefined => {
    const sistePeriode = sisteValgbarePeriode(person);

    return sistePeriode && maksdatoForPeriode(sistePeriode);
};

export const sisteValgbarePeriode = (person: Person): Vedtaksperiode | undefined =>
    person.arbeidsgivere
        .flatMap(({ vedtaksperioder }) => vedtaksperioder)
        .filter(({ fullstendig }) => fullstendig)
        .map((periode) => periode as Vedtaksperiode)
        .reduce(
            (sistePeriode: Vedtaksperiode | undefined, it) =>
                it.tom.isAfter(sistePeriode?.tom ?? dayjs(0)) ? it : sistePeriode,
            undefined
        );

export const getAlderVedSisteSykedag = (
    fødselsdato: string,
    periode: TidslinjeperiodeMedSykefravær | TidslinjeperiodeUtenSykefravær
): number | undefined => {
    if (periode.tilstand === 'utenSykefravær') {
        return undefined;
    }
    const sykedager = (periode as TidslinjeperiodeMedSykefravær).utbetalingstidslinje.filter((it) => it.type === 'Syk');

    if (sykedager.length < 1) return undefined;
    return sykedager
        .reduce((sisteDag: Utbetalingsdag, dagen: Utbetalingsdag) =>
            dagen.dato.isAfter(sisteDag.dato) ? dagen : sisteDag
        )
        .dato.diff(fødselsdato, 'year');
};

export const getMånedsbeløp = (
    vedtaksperiode: Vedtaksperiode | undefined,
    organisasjonsnummer: string
): number | undefined =>
    vedtaksperiode?.inntektsgrunnlag?.inntekter?.find((it) => it.organisasjonsnummer === organisasjonsnummer)
        ?.omregnetÅrsinntekt?.månedsbeløp;
