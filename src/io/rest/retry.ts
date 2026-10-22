import { HttpError } from '@app/fetch/fetchClient';

const MAKS_ANTALL_NYE_FORSØK = 1;

// Ett nytt forsøk tar forbigående nettverks- og serverfeil. Klientfeil (4xx) blir ikke bedre av å prøve igjen,
// og ved vedvarende feil skal saksbehandler få feilmeldingen raskt og kunne prøve selv.
export function prøvPåNyttVedForbigåendeFeil(antallFeil: number, error: unknown): boolean {
    if (antallFeil >= MAKS_ANTALL_NYE_FORSØK) return false;
    const status = (error as HttpError | null)?.status;
    return status === undefined || status >= 500;
}
