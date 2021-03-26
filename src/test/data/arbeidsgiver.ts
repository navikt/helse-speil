import { umappetVedtaksperiode } from './vedtaksperiode';
import { EksternUtbetalingshistorikkElement, SpesialistArbeidsgiver, SpesialistOverstyring } from 'external-types';
import { umappetUtbetalingshistorikk } from './utbetalingshistorikk';

export const umappetArbeidsgiver = (
    vedtaksperioder = [umappetVedtaksperiode()],
    overstyringer: SpesialistOverstyring[] = [],
    utbetalingshistorikk: EksternUtbetalingshistorikkElement[] = [umappetUtbetalingshistorikk()]
): SpesialistArbeidsgiver => ({
    organisasjonsnummer: '987654321',
    id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
    navn: 'Potetsekk AS',
    bransjer: ['Sofasitting', 'TV-titting'],
    vedtaksperioder: vedtaksperioder,
    overstyringer: overstyringer,
    utbetalingshistorikk: utbetalingshistorikk,
});
