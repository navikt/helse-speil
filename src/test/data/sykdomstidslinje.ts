import { Dayjs } from 'dayjs';
import {
    SpleisSykdomsdag,
    SpleisSykdomsdagkilde,
    SpleisSykdomsdagkildeType,
    SpleisSykdomsdagtype,
} from 'external-types';

// const inntektsmeldingId = '512781D2-690E-4B4B-8A00-84A5FCC41AEE';

const søknadId = 'D94DD20F-8B95-4769-87DA-80F8F3AE6576';

const sykmeldingId = 'DC7A5F57-DE63-4648-9631-B50C100859BA';

const erHelg = (dato: Dayjs) => dato.day() === 0 || dato.day() === 6;

const sykdomsdagtype = (dato: Dayjs) =>
    erHelg(dato) ? SpleisSykdomsdagtype.SYK_HELGEDAG : SpleisSykdomsdagtype.SYKEDAG;

const kilde = (dato: Dayjs): SpleisSykdomsdagkilde =>
    erHelg(dato)
        ? { type: SpleisSykdomsdagkildeType.SØKNAD, kildeId: søknadId }
        : { type: SpleisSykdomsdagkildeType.SYKMELDING, kildeId: sykmeldingId };

const tilSykdomsdag = (dato: Dayjs, grad: number = 100): SpleisSykdomsdag => ({
    dagen: dato.format('YYYY-MM-DD'),
    type: sykdomsdagtype(dato),
    kilde: kilde(dato),
    grad: grad,
});

export const sykdomstidslinje = (fom: Dayjs, tom: Dayjs): SpleisSykdomsdag[] =>
    new Array(tom.diff(fom, 'day') + 1)
        .fill({})
        .map((_, i) => fom.add(i, 'day'))
        .map((datoen) => tilSykdomsdag(datoen));
