import dayjs from 'dayjs';
import { mappetPerson } from 'test-data';

import { umappetArbeidsgiver } from '../../../../test/data/arbeidsgiver';
import { umappetUtbetalingshistorikk } from '../../../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { UtbetalingToggles } from '../../../featureToggles';
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

describe('rekursive revurderinger', () => {
    const tidslinjeperiode = person.arbeidsgivere[0].tidslinjeperioder?.[0]?.[0];
    test('skal kunne revurdere revurdert periode med toggle på', () => {
        expect(revurderingEnabled(person, tidslinjeperiode, skruPåRekursivRevurdering)).toBe(true);
    });

    test('skal ikke kunne revurdere revurdert periode med toggle av', () => {
        expect(revurderingEnabled(person, tidslinjeperiode, skruAvRekursivRevurdering)).toBe(false);
    });
});

const skruPåRekursivRevurdering: UtbetalingToggles = {
    rekursivRevurderingEnabled: true,
    overstyreUtbetaltPeriodeEnabled: true,
    overstyrbareTabellerEnabled: true,
};
const skruAvRekursivRevurdering: UtbetalingToggles = {
    rekursivRevurderingEnabled: false,
    overstyreUtbetaltPeriodeEnabled: true,
    overstyrbareTabellerEnabled: true,
};
