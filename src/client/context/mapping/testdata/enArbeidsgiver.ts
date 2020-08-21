import { enVedtaksperiode } from './enVedtaksperiode';
import { SpesialistOverstyring } from '../types.external';

export const enArbeidsgiver = (
    vedtaksperioder = [enVedtaksperiode()],
    overstryringer: SpesialistOverstyring[] = []
) => ({
    organisasjonsnummer: '123456789',
    id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
    navn: 'Potetsekk AS',
    risikovurderinger: [],
    vedtaksperioder: vedtaksperioder,
    overstyringer: overstryringer,
});
