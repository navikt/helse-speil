export const umappetGhostPeriode = (
    fom: DateString,
    tom: DateString,
    skjæringstidspunkt: DateString,
    vilkårsgrunnlagHistorikkId: string,
    deaktivert: boolean
): ExternalGhostperiode => ({
    fom: fom,
    tom: tom,
    skjæringstidspunkt: skjæringstidspunkt,
    vilkårsgrunnlagHistorikkInnslagId: vilkårsgrunnlagHistorikkId,
    deaktivert: deaktivert,
});
