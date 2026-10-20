const LEGG_TIL_SEGMENT = '/leggtil';

/**
 * Undersider som ikke viser en periode fra tidslinjen, og som derfor må navigere tilbake til
 * saksbildet når brukeren velger en periode.
 */
export const erPåEgenUnderside = (pathname: string): boolean =>
    pathname.includes('/tilkommeninntekt/') || pathname.endsWith(LEGG_TIL_SEGMENT);

/**
 * Undersider der saksbildet ikke skal regne noen periode som aktiv.
 */
export const erPåSideUtenAktivPeriode = (pathname: string): boolean =>
    pathname.includes('/tilkommeninntekt/') || pathname.endsWith(LEGG_TIL_SEGMENT);

/**
 * Saksbildet for en person, med eller uten valgt periode i URL-en.
 */
export const erPåPeriodeside = (pathname: string): boolean =>
    /^\/person\/[^/]+(\/periode\/[^/]+(\/behandling\/[^/]+)?)?\/?$/.test(pathname);

export type PeriodeUrlId = {
    periodeId: string;
    behandlingId?: string;
};

export function lagPeriodeUrl(
    personPseudoId: string,
    { periodeId, behandlingId }: PeriodeUrlId,
    tabAnker?: string,
): string {
    const behandlingSegment = behandlingId ? `/behandling/${behandlingId}` : '';
    return `/person/${personPseudoId}/periode/${periodeId}${behandlingSegment}${tabAnker ? `#${tabAnker}` : ''}`;
}
