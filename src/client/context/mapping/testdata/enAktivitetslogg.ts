import { SpleisAktivitet, SpleisAlvorlighetsgrad } from '../types.external';

export const enAktivitet = (
    melding: string = 'Aktivitetsloggvarsel',
    tidsstempel: string = '2020-04-03T07:40:47.261Z',
    alvorlighetsgrad: SpleisAlvorlighetsgrad = 'W'
): SpleisAktivitet => ({
    vedtaksperiodeId: 'vedtaksperiodeId',
    alvorlighetsgrad: alvorlighetsgrad,
    melding: melding,
    tidsstempel: tidsstempel,
});
