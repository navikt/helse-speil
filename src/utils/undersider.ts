const LEGG_TIL_SEGMENT = '/leggtil';

/**
 * Undersider som ikke viser en periode fra tidslinjen, og som derfor må navigere tilbake til
 * saksbildet når brukeren velger en periode.
 */
export const erPåEgenUnderside = (pathname: string): boolean =>
    pathname.includes('/tilkommeninntekt/') ||
    pathname.includes('/andreytelser/') ||
    pathname.endsWith(LEGG_TIL_SEGMENT);

/**
 * Undersider der saksbildet ikke skal regne noen periode som aktiv.
 */
export const erPåSideUtenAktivPeriode = (pathname: string): boolean =>
    pathname.includes('/tilkommeninntekt/') ||
    pathname.includes('/andreytelser/') ||
    pathname.endsWith(LEGG_TIL_SEGMENT);
