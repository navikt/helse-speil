export const useHarVurderLovvalgOgMedlemskapVarsel = (): boolean => {
    return false;

    /* TODO: Koden under skal kommenteres inn hvis man blir enige om at RV_MV_3 skal medføre totrinn.
        Hvis det blir bestemt at den ikke skal medføre totrinn kan hooken og bruk av den fjernes. */

    // const periode = useActivePeriod();
    // const arbeidsgiver = useCurrentArbeidsgiver();
    //
    // if (!isBeregnetPeriode(periode) || !arbeidsgiver) {
    //     return false;
    // }
    //
    // const vedtaksperiodeHarIkkeBlittUtbetaltFør = !harBlittUtbetaltTidligere(periode, arbeidsgiver);
    //
    // return (
    //     vedtaksperiodeHarIkkeBlittUtbetaltFør &&
    //     periode.varslerForGenerasjon.some((varsel) => varsel.kode === 'RV_MV_3')
    // );
};
