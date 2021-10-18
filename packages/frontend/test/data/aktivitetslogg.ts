export const aktivitet = (
    melding: string = 'Aktivitetsloggvarsel',
    tidsstempel: string = '2020-04-03T07:40:47.261Z',
    alvorlighetsgrad: ExternalAktivitet['alvorlighetsgrad'] = 'W'
): ExternalAktivitet => ({
    vedtaksperiodeId: 'vedtaksperiodeId',
    alvorlighetsgrad: alvorlighetsgrad,
    melding: melding,
    tidsstempel: tidsstempel,
});

export const aktivitetslogg = () => [aktivitet()];
