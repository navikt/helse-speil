import { HttpError } from '@app/fetch/fetchClient';

import { prøvPåNyttVedForbigåendeFeil } from './retry';

describe('prøvPåNyttVedForbigåendeFeil', () => {
    it('prøver på nytt én gang ved serverfeil', () => {
        expect(prøvPåNyttVedForbigåendeFeil(0, httpError(500))).toBe(true);
        expect(prøvPåNyttVedForbigåendeFeil(0, httpError(503))).toBe(true);
        expect(prøvPåNyttVedForbigåendeFeil(1, httpError(500))).toBe(false);
    });

    it('prøver på nytt én gang ved nettverksfeil', () => {
        expect(prøvPåNyttVedForbigåendeFeil(0, new TypeError('Failed to fetch'))).toBe(true);
        expect(prøvPåNyttVedForbigåendeFeil(1, new TypeError('Failed to fetch'))).toBe(false);
    });

    it('prøver ikke på nytt ved klientfeil', () => {
        expect(prøvPåNyttVedForbigåendeFeil(0, httpError(400))).toBe(false);
        expect(prøvPåNyttVedForbigåendeFeil(0, httpError(403))).toBe(false);
        expect(prøvPåNyttVedForbigåendeFeil(0, httpError(404))).toBe(false);
    });
});

function httpError(status: number): HttpError {
    const error: HttpError = new Error(`Request failed with status code ${status}`);
    error.status = status;
    return error;
}
