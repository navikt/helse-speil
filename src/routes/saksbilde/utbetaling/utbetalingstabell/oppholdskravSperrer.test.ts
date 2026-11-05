import { ApiBegrunnelse } from '@io/rest/generated/spesialist.schemas';
import { getUtbetalingstabellDag } from '@test-data/utbetalingstabell';

import { dagerAvslåttForSenMeldingTilNav, dagerMedOppholdskrav, somDagliste } from './oppholdskravSperrer';

describe('dagerAvslåttForSenMeldingTilNav', () => {
    it('finner dager som saksbehandler har avslått fordi melding til Nav kom for sent', () => {
        const avslått = getUtbetalingstabellDag({
            dato: '2024-07-15',
            erAvvist: true,
            begrunnelser: [ApiBegrunnelse.AVSLATT_MELDING_TIL_NAV_DAG],
        });
        const sykedag = getUtbetalingstabellDag({ dato: '2024-07-16' });

        expect(dagerAvslåttForSenMeldingTilNav([avslått, sykedag])).toEqual([avslått]);
    });

    it('lar dager med oppholdskrav og maskinelle avvisninger være valgbare', () => {
        const oppholdskrav = getUtbetalingstabellDag({ begrunnelser: [ApiBegrunnelse.OPPHOLDSKRAV] });
        const maksdato = getUtbetalingstabellDag({ begrunnelser: [ApiBegrunnelse.SYKEPENGEDAGER_OPPBRUKT] });
        const utenBegrunnelser = getUtbetalingstabellDag({ begrunnelser: null });

        expect(dagerAvslåttForSenMeldingTilNav([oppholdskrav, maksdato, utenBegrunnelser])).toEqual([]);
    });
});

describe('dagerMedOppholdskrav', () => {
    it('finner dager som er avslått etter oppholdskravet', () => {
        const oppholdskrav = getUtbetalingstabellDag({
            dato: '2024-07-15',
            begrunnelser: [ApiBegrunnelse.SYKEPENGEDAGER_OPPBRUKT, ApiBegrunnelse.OPPHOLDSKRAV],
        });
        const sykedag = getUtbetalingstabellDag({ dato: '2024-07-16', begrunnelser: [] });

        expect(dagerMedOppholdskrav([oppholdskrav, sykedag])).toEqual([oppholdskrav]);
    });
});

describe('somDagliste', () => {
    it('lister dagene i datorekkefølge på norsk format', () => {
        expect(somDagliste(['2024-07-16', '2024-07-15'])).toBe('15.07.2024, 16.07.2024');
    });
});
