import selectors from './selectors';

const testData = {
    beregning: {
        dagsatser: [
            {
                skalUtbetales: true
            },
            {
                skalUtbetales: false
            },
            {
                skalUtbetales: true
            }
        ]
    }
};

test('Antall dager beregnes fra dagsats og utbetaling', () => {
    expect(selectors.antallUtbetalingsdager(testData)).toEqual(2);
});
