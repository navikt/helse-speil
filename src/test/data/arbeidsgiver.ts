import { testOrganisasjonsnummer } from './person';
import { umappetUtbetalingshistorikk } from './utbetalingshistorikk';
import { umappetVedtaksperiode } from './vedtaksperiode';

export const umappetArbeidsgiver = (
    vedtaksperioder: (ExternalVedtaksperiode | ExternalUfullstendigVedtaksperiode)[] = [umappetVedtaksperiode()],
    overstyringer: ExternalOverstyring[] = [],
    utbetalingshistorikk: ExternalHistorikkElement[] = [umappetUtbetalingshistorikk()],
    organisasjonsnummer: string = testOrganisasjonsnummer
): ExternalArbeidsgiver => ({
    organisasjonsnummer: organisasjonsnummer,
    id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
    navn: 'Potetsekk AS',
    bransjer: ['Sofasitting', 'TV-titting'],
    vedtaksperioder: vedtaksperioder,
    overstyringer: overstyringer,
    utbetalingshistorikk: utbetalingshistorikk,
    generasjoner: [],
});
