import {
    EksternUtbetalingshistorikkElement,
    SpesialistArbeidsgiver,
    SpesialistOverstyring,
    SpesialistVedtaksperiode,
    UfullstendigSpesialistVedtaksperiode,
} from 'external-types';

import { umappetUtbetalingshistorikk } from './utbetalingshistorikk';
import { umappetVedtaksperiode } from './vedtaksperiode';

export const umappetArbeidsgiver = (
    vedtaksperioder: (SpesialistVedtaksperiode | UfullstendigSpesialistVedtaksperiode)[] = [umappetVedtaksperiode()],
    overstyringer: SpesialistOverstyring[] = [],
    utbetalingshistorikk: EksternUtbetalingshistorikkElement[] = [umappetUtbetalingshistorikk()],
    organisasjonsnummer: string = '987654321'
): SpesialistArbeidsgiver => ({
    organisasjonsnummer: organisasjonsnummer,
    id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
    navn: 'Potetsekk AS',
    bransjer: ['Sofasitting', 'TV-titting'],
    vedtaksperioder: vedtaksperioder,
    overstyringer: overstyringer,
    utbetalingshistorikk: utbetalingshistorikk,
});
