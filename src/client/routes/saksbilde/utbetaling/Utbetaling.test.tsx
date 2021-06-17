import dayjs from 'dayjs';
import { mappetPerson } from 'test-data';

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
                'UTBETALT',
                dayjs('2020-01-01T00:00:00'),
                dayjs('2020-01-01')
            ),
        ]
    ),
]);

describe('med toggle på', () => {
    const tidslinjeperiode = person.arbeidsgivere[0].tidslinjeperioder?.[0]?.[0];
    test('skal vi kunne revurdere en revurdert tidslinje', () => {
        expect(revurderingEnabled(person, tidslinjeperiode, true)).toBe(true);
    });

    test('skal vi ikke kunne revurdere en revurdert tidslinje', () => {
        expect(revurderingEnabled(person, tidslinjeperiode, false)).toBe(false);
    });
});
