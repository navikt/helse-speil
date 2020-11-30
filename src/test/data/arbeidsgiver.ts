import { umappetVedtaksperiode } from './vedtaksperiode';
import { SpesialistArbeidsgiver, SpesialistOverstyring } from 'external-types';

export const umappetArbeidsgiver = (
    vedtaksperioder = [umappetVedtaksperiode()],
    overstyringer: SpesialistOverstyring[] = []
): SpesialistArbeidsgiver => ({
    organisasjonsnummer: '987654321',
    id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
    navn: 'Potetsekk AS',
    vedtaksperioder: vedtaksperioder,
    overstyringer: overstyringer,
});
