import dayjs, { Dayjs } from 'dayjs';
import { mappetPerson } from 'test-data';

import { Tidslinjetilstand } from '../../../mapping/arbeidsgiver';
import { Periodetype, Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';

import { umappetArbeidsgiver } from '../../../../test/data/arbeidsgiver';
import { umappetUtbetalingshistorikk } from '../../../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { revurderingEnabled } from './Utbetaling';

const person = mappetPerson([
    umappetArbeidsgiver(
        [umappetVedtaksperiode()],
        [],
        [
            umappetUtbetalingshistorikk(
                'id1',
                'REVURDERING',
                'REVURDERT',
                dayjs('2020-01-01T00:00:00'),
                dayjs('2020-01-01')
            ),
        ]
    ),
]);

describe('med toggle på', () => {
    test('skal vi kunne revurdere en revurdert tidslinje', () => {
        expect(revurderingEnabled(person, person.arbeidsgivere[0].tidslinjeperioder?.[0]?.[0], true)).toBe(true);
    });
});
describe('med toggle av', () => {
    test('skal vi ikke kunne revurdere en revurdert tidslinje', () => {
        expect(revurderingEnabled(person, person.arbeidsgivere[0].tidslinjeperioder?.[0]?.[0], false)).toBe(false);
    });
});

const enTidslinjeperiode = (
    tilstand: Tidslinjetilstand = Tidslinjetilstand.Revurdert,
    fom: Dayjs = dayjs('2021-01-01'),
    tom: Dayjs = dayjs('2021-01-31'),
    periodetype: Periodetype = Periodetype.REVURDERING
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
