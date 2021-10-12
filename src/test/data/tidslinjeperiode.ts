import dayjs, { Dayjs } from 'dayjs';

import { testBeregningId } from './person';

export const enTidslinjeperiode = (
    tilstand: Tidslinjetilstand = 'oppgaver',
    fom: Dayjs = dayjs('2021-01-01'),
    tom: Dayjs = dayjs('2021-01-31'),
    periodetype: Tidslinjeperiode['type'] = 'VEDTAKSPERIODE'
): Tidslinjeperiode => {
    return {
        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
        beregningId: testBeregningId,
        unique: 'unique_id',
        fom: fom,
        tom: tom,
        type: periodetype,
        inntektskilde: 'EN_ARBEIDSGIVER',
        tilstand: tilstand,
        utbetalingstidslinje: [],
        sykdomstidslinje: [],
        organisasjonsnummer: '987654321',
        fullstendig: true,
        opprettet: dayjs('2020-01-01T:00:00:00'),
        oppgavereferanse: 'en-oppgavereferanse',
        vilkårsgrunnlaghistorikkId: 'vilkårsgrunnlaghistorikkId',
        skjæringstidspunkt: fom.format('YYYY-MM-DD'),
    };
};
