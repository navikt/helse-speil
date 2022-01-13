export const umappetGhostPeriode = (
    fom: DateString,
    tom: DateString,
    skjæringstidspunkt: DateString,
    vilkårsgrunnlagHistorikkId: string
): ExternalGhostperiode => ({
    fom: fom,
    tom: tom,
    skjæringstidspunkt: skjæringstidspunkt,
    vilkårsgrunnlagHistorikkInnslagId: vilkårsgrunnlagHistorikkId,
});
