import { fetchMock, jsonBody, mockFetchResponse } from '../../../../../vitest.setup';
import { Mock, vi } from 'vitest';

import { Kildetype } from '@io/graphql';
import { ApiServerSentEvent, ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { useAktivtInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { renderHook } from '@test-utils';
import { act, waitFor } from '@testing-library/react';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { tilOverstyrteDager, useOverstyrDager } from './useOverstyrDager';

vi.mock('@state/person');
vi.mock('@state/inntektsforhold/inntektsforhold');
vi.mock('@state/toasts');
vi.mock('@state/serverSentEvents', async () => ({
    ...(await vi.importActual('@state/serverSentEvents')),
    useHåndterNyttEvent: vi.fn(),
}));

const ORGNUMMER = '987654321';
const VEDTAKSPERIODE_ID = 'vedtaksperiode';
const BEGRUNNELSE = 'begrunnelse';

describe('useOverstyrDager', () => {
    beforeEach(() => {
        (useAktivtInntektsforhold as Mock).mockReturnValue({ organisasjonsnummer: ORGNUMMER });
        (useAddToast as Mock).mockReturnValue(() => {});
        (useRemoveToast as Mock).mockReturnValue(() => {});
        (useHåndterNyttEvent as Mock).mockReturnValue(() => {});
    });

    test('skal ha default verdier ved oppstart', async () => {
        const { result } = renderHook(() => useOverstyrDager());
        expect(result.current.error).toBe(undefined);
        expect(result.current.done).toBe(false);
    });

    test('skal poste overstyring av tidslinje til REST-endepunktet', async () => {
        mockFetchResponse(undefined);
        const { result } = renderHook(() => useOverstyrDager());

        const callback = vi.fn();
        await act(() =>
            result.current.postOverstyring(dager, oversyrteDager, BEGRUNNELSE, VEDTAKSPERIODE_ID, callback),
        );

        expect(fetchMock).toHaveBeenCalledWith(
            `/api/spesialist/vedtaksperioder/${VEDTAKSPERIODE_ID}/overstyringer/tidslinje`,
            expect.objectContaining({
                method: 'POST',
                body: jsonBody({
                    begrunnelse: BEGRUNNELSE,
                    dager: tilOverstyrteDager(dager, oversyrteDager),
                }),
            }),
        );
        await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));
    });

    test('skal ha done lik true etter ny saksbehandleroppgave-event', async () => {
        mockFetchResponse(undefined);

        (useHåndterNyttEvent as Mock).mockImplementation((onNyttEvent: (o: ApiServerSentEvent) => void) => {
            onNyttEvent({
                event: ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE,
                data: null,
            });
        });

        const { result } = renderHook(() => useOverstyrDager());

        await act(() => result.current.postOverstyring(dager, oversyrteDager, BEGRUNNELSE, VEDTAKSPERIODE_ID));

        await waitFor(() => expect(result.current.done).toBeTruthy());
    });

    test('skal ha error hvis REST-overstyringen feiler', async () => {
        mockFetchResponse(undefined, 500);
        const { result, rerender } = renderHook(() => useOverstyrDager());

        await act(() => result.current.postOverstyring(dager, oversyrteDager, BEGRUNNELSE, VEDTAKSPERIODE_ID));

        rerender();
        await waitFor(() => expect(result.current.error).not.toBeUndefined());
    });
});

const dager: Utbetalingstabelldag[] = [
    {
        dag: {
            overstyrtDagtype: 'Sykedag',
            speilDagtype: 'Syk',
            visningstekst: 'Syk',
        },
        dato: '2020-01-01',
        grad: 100,
        kilde: { __typename: 'Kilde', id: '1', type: Kildetype.Soknad },
        erForeldet: false,
        erAGP: false,
        erVentetid: false,
        erAvvist: false,
        erMaksdato: false,
    },
];
const oversyrteDager: Utbetalingstabelldag[] = [
    {
        dag: {
            overstyrtDagtype: 'Feriedag',
            speilDagtype: 'Ferie',
            visningstekst: 'Ferie',
        },
        dato: '2020-01-01',
        grad: undefined,
        kilde: { __typename: 'Kilde', id: '2', type: Kildetype.Saksbehandler },
        erForeldet: false,
        erAGP: false,
        erVentetid: false,
        erAvvist: false,
        erMaksdato: false,
    },
];
