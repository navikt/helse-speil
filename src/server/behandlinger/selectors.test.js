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
    },
    avklarteVerdier: {
        maksdato: {
            grunnlag: {
                personensAlder: 40
            },
            yrkesstatus: 'ARBEIDSTAKER'
        }
    }
};

const testFørsteSykdomsdag = '2019-09-02';
const testMaksdato = '2020-04-20';

test('Antall dager beregnes fra dagsats og utbetaling', () => {
    expect(selectors.antallUtbetalingsdager(testData)).toEqual(2);
});

test('utbetalingsbeløp beregnes ved å summere alle dagbeløp som skal utbetales', () => {
    expect(selectors.utbetalingsbeløp(testData)).toEqual(500);
});

test('Antall brukte og gjenstående sykepengedager beregnes fra alder, yrkesstatus og maksdato', () => {
    expect(
        selectors.sykepengedager(testData, testFørsteSykdomsdag, testMaksdato).antallDagerIgjen
    ).toEqual(166);
    expect(
        selectors.sykepengedager(testData, testFørsteSykdomsdag, testMaksdato).antallDagerBrukt
    ).toEqual(82);
});
