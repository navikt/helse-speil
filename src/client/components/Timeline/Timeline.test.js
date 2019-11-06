import { _findDagsats } from './Timeline';

const utbetalingslinjer = [
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
    expect(_findDagsats('2019-09-19', utbetalingslinjer)).toBe(0);
    expect(_findDagsats('2019-09-20', utbetalingslinjer)).toBe(100);
    expect(_findDagsats('2019-09-27', utbetalingslinjer)).toBe(100);

    expect(_findDagsats('2019-09-28', utbetalingslinjer)).toBe(200);
    expect(_findDagsats('2019-10-05', utbetalingslinjer)).toBe(200);
    expect(_findDagsats('2019-10-06', utbetalingslinjer)).toBe(0);
});
