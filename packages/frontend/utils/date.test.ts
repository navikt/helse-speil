import '@testing-library/jest-dom/extend-expect';

import { somDato } from '../mapping/vedtaksperiode';

import { findEarliest, findLatest } from './date';

test('findLatest', () => {
    const dates = [somDato('2018-01-31'), somDato('2018-02-26'), somDato('2018-02-27'), somDato('2017-01-31')];
    expect(findLatest(dates)).toEqual(somDato('2018-02-27'));
    expect(dates.length).toEqual(4);
});

test('findEarliest', () => {
    const dates = [
        somDato('2018-01-31'),
        somDato('2018-02-26'),
        somDato('2018-02-27'),
        somDato('2017-01-01'),
        somDato('2017-01-31'),
    ];
    expect(findEarliest(dates)).toEqual(somDato('2017-01-01'));
    expect(dates.length).toEqual(5);
});
