import selectors from './selectors';

const testData = {
    beregning: {
        dagsatser: [
            {
                sats: 100,
                skalUtbetales: true
            },
            {
                sats: 200,
                skalUtbetales: false
            },
            {
                sats: 400,
                skalUtbetales: true
            }
        ]
    }
};

test('Antall dager beregnes fra dagsats og utbetaling', () => {
    expect(selectors.antallUtbetalingsdager(testData)).toEqual(2);
});

test('utbetalingsbeløp beregnes ved å summere alle dagbeløp som skal utbetales', () => {
    expect(selectors.utbetalingsbeløp(testData)).toEqual(500);
});
