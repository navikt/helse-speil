'use strict';

import '@testing-library/jest-dom/extend-expect';

const fs = require('fs');

const mapping = require('./mapping');

const readTestdata = () => {
    return fs.readFileSync('__mock-data__/tidslinjeperson.json').toString();
};

test('sykdomstidslinje', async () => {
    const spleisPerson = JSON.parse(readTestdata());
    const sykdomstidslinje = mapping.person(spleisPerson).sykdomstidslinje;
    const expected = [
        {
            date: '2019-09-10',
            type: 'SYKEDAG'
        },
        {
            date: '2019-09-11',
            type: 'SYKEDAG'
        }
    ];
    expect(sykdomstidslinje).toEqual(expected);
});
