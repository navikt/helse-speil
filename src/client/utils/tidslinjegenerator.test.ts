import dayjs from 'dayjs';

import { tidslinjegenerator } from './tidslinjegenerator';

//Denne kan brukes til å generere utbetalingstidslinjer til bruk i testdata som brukes lokalt i speil
test('generer tidslinje', () => {
    const generertTidslinje = tidslinjegenerator(dayjs('2018-05-01'), dayjs('2018-05-20'), 1431, 1431, 100, 100);
    expect(generertTidslinje.length).toBeGreaterThan(0);
});
