import { _findDagsats } from './Timeline';

const utbetalingsperioder = [
    {
        fom: '2019-09-20',
        tom: '2019-09-27',
        dagsats: 100
    },
    {
        fom: '2019-09-28',
        tom: '2019-10-05',
        dagsats: 200
    }
];

test('findDagsats finner riktig dagsats for dato', () => {
    expect(_findDagsats('2019-09-19', utbetalingsperioder)).toBe(0);
    expect(_findDagsats('2019-09-20', utbetalingsperioder)).toBe(100);
    expect(_findDagsats('2019-09-27', utbetalingsperioder)).toBe(100);

    expect(_findDagsats('2019-09-28', utbetalingsperioder)).toBe(200);
    expect(_findDagsats('2019-10-05', utbetalingsperioder)).toBe(200);
    expect(_findDagsats('2019-10-06', utbetalingsperioder)).toBe(0);
});
