import dayjs, { Dayjs } from 'dayjs';
import { SpleisVedtaksperiodetilstand, UfullstendigSpesialistVedtaksperiode } from 'external-types';

import { UfullstendigVedtaksperiodeBuilder } from '../../client/mapping/ufullstendigVedtaksperiode';

import { umappetArbeidsgiver } from './arbeidsgiver';
import { umappetPerson } from './person';
import { sykdomstidslinje } from './sykdomstidslinje';
import { utbetalingstidslinje } from './utbetalingstidslinje';

type UmappetVedtaksperiodeOptions = {
    fom?: Dayjs;
    tom?: Dayjs;
    id?: string;
};

export const umappetUfullstendigVedtaksperiode = (
    options?: UmappetVedtaksperiodeOptions
): UfullstendigSpesialistVedtaksperiode => {
    const fom = options?.fom ?? dayjs('2020-01-01');
    const tom = options?.tom ?? dayjs('2020-01-31');
    const id = options?.id ?? 'fa02d7a5-daf2-488c-9798-2539edd7fe3g';
    const sykdomsdager = sykdomstidslinje(fom, tom);
    const utbetalingsdager = utbetalingstidslinje(sykdomsdager, 1500);
    return {
        id: id,
        fom: fom.format('YYYY-MM-DD'),
        tom: tom.format('YYYY-MM-DD'),
        tilstand: SpleisVedtaksperiodetilstand.Venter,
        gruppeId: 'en-gruppeId',
        fullstendig: false,
        utbetalingstidslinje: utbetalingsdager,
    };
};

export const mappetUfullstendigVedtaksperiode = (
    fom: Dayjs = dayjs('2020-01-01'),
    tom: Dayjs = dayjs('2020-01-31')
): UfullstendigVedtaksperiode => {
    let { ufullstendigVedtaksperiode } = new UfullstendigVedtaksperiodeBuilder(
        umappetPerson(),
        umappetArbeidsgiver(),
        umappetUfullstendigVedtaksperiode({ fom, tom })
    ).build();

    return ufullstendigVedtaksperiode as UfullstendigVedtaksperiode;
};
