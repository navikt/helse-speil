import { enVedtaksperiode } from './enVedtaksperiode';

export const enArbeidsgiver = (vedtaksperioder = [enVedtaksperiode()]) => ({
    organisasjonsnummer: '123456789',
    id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
    vedtaksperioder: vedtaksperioder
});
