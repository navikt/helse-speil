import dayjs, { Dayjs } from 'dayjs';

import { Tidslinjetilstand } from '../../client/mapping/arbeidsgiver';
import { Periodetype, Tidslinjeperiode } from '../../client/modell/UtbetalingshistorikkElement';

export const enTidslinjeperiode = (
    tilstand: Tidslinjetilstand = Tidslinjetilstand.Oppgaver,
    fom: Dayjs = dayjs('2021-01-01'),
    tom: Dayjs = dayjs('2021-01-31'),
    periodetype: Periodetype = Periodetype.VEDTAKSPERIODE
): Tidslinjeperiode => {
    return {
        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
        beregningId: 'id1',
        unique: 'unique_id',
        fom: fom,
        tom: tom,
        type: periodetype,
        tilstand: tilstand,
        utbetalingstidslinje: [],
        sykdomstidslinje: [],
        organisasjonsnummer: '987654321',
        fullstendig: true,
        opprettet: dayjs('2020-01-01T:00:00:00'),
    };
};
