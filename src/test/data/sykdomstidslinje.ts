import { Dayjs } from 'dayjs';

const søknadId = 'D94DD20F-8B95-4769-87DA-80F8F3AE6576';

const sykmeldingId = 'DC7A5F57-DE63-4648-9631-B50C100859BA';

const erHelg = (dato: Dayjs) => dato.day() === 0 || dato.day() === 6;

const sykdomsdagtype = (dato: Dayjs): ExternalSykdomsdagtype => (erHelg(dato) ? 'SYK_HELGEDAG' : 'SYKEDAG');

const kilde = (dato: Dayjs): ExternalSykdomsdag['kilde'] =>
    erHelg(dato) ? { type: 'Søknad', kildeId: søknadId } : { type: 'Sykmelding', kildeId: sykmeldingId };

const tilSykdomsdag = (dato: Dayjs, grad: number = 100): ExternalSykdomsdag => ({
    dagen: dato.format('YYYY-MM-DD'),
    type: sykdomsdagtype(dato),
    kilde: kilde(dato),
    grad: grad,
});

export const sykdomstidslinje = (fom: Dayjs, tom: Dayjs): ExternalSykdomsdag[] =>
    new Array(tom.diff(fom, 'day') + 1)
        .fill({})
        .map((_, i) => fom.add(i, 'day'))
        .map((datoen) => tilSykdomsdag(datoen));
