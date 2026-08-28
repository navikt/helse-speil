import { Mock, vi } from 'vitest';

import { customAxios } from '@app/axios/axiosClient';
import { ApiServerSentEvent, ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { visningenErOppdatertToastKey, visningenOppdateresToastKey } from '@state/oppdateringToasts';
import { useSlettLokaleOverstyringer } from '@state/overstyring';
import { useHåndterNyttEvent } from '@state/serverSentEvents';
import { ToastObject, useAddToast, useRemoveToast } from '@state/toasts';
import { renderHook } from '@test-utils';
import { act, waitFor } from '@testing-library/react';

import { usePostOverstyrtInntektOgRefusjon } from './usePostOverstyrtInntektOgRefusjon';

vi.mock('@state/toasts');
vi.mock('@state/serverSentEvents', async () => ({
    ...(await vi.importActual('@state/serverSentEvents')),
    useHåndterNyttEvent: vi.fn(),
}));
vi.mock('@state/overstyring', async () => ({
    ...(await vi.importActual('@state/overstyring')),
    useSlettLokaleOverstyringer: vi.fn(),
}));

const addToastMock = vi.fn();
const slettLokaleOverstyringerMock = vi.fn();

const VEDTAKSPERIODE_ID = '123';

describe('usePostOverstyrtInntektOgRefusjon', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAddToast as Mock).mockReturnValue((toast: ToastObject) => {
            addToastMock(toast);
        });
        (useRemoveToast as Mock).mockReturnValue(() => {});
        (useHåndterNyttEvent as Mock).mockReturnValue(() => {});
        (useSlettLokaleOverstyringer as Mock).mockReturnValue(slettLokaleOverstyringerMock);
    });

    it('skal ha initial state ved oppstart', () => {
        const { result } = renderHook(usePostOverstyrtInntektOgRefusjon);
        const { isLoading, error } = result.current;
        expect(isLoading).toBeFalsy();
        expect(error).toBeUndefined();
    });

    it('skal poste overstyring av inntekt og refusjon til REST-endepunktet', async () => {
        (customAxios as unknown as Mock).mockResolvedValue({ data: undefined, status: 204 });
        const { result } = renderHook(usePostOverstyrtInntektOgRefusjon);

        await act(() =>
            result.current.postOverstyring({
                aktørId: 'aktørid',
                fødselsnummer: 'fødselsnummer',
                skjæringstidspunkt: '2020-01-01',
                arbeidsgivere: [
                    {
                        begrunnelse: 'begrunnelse',
                        forklaring: 'forklaring',
                        fraMånedligInntekt: 10000,
                        månedligInntekt: 20000,
                        organisasjonsnummer: 'organisasjonsnummer',
                        fraRefusjonsopplysninger: [],
                        refusjonsopplysninger: [],
                        fom: undefined,
                        tom: undefined,
                    },
                ],
                vedtaksperiodeId: VEDTAKSPERIODE_ID,
            }),
        );

        expect(customAxios).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `/api/spesialist/vedtaksperioder/${VEDTAKSPERIODE_ID}/overstyringer/inntekt-og-refusjon`,
                method: 'POST',
                data: {
                    skjæringstidspunkt: '2020-01-01',
                    arbeidsgivere: [
                        {
                            organisasjonsnummer: 'organisasjonsnummer',
                            månedligInntekt: 20000,
                            fraMånedligInntekt: 10000,
                            refusjonsopplysninger: [],
                            fraRefusjonsopplysninger: [],
                            begrunnelse: 'begrunnelse',
                            forklaring: 'forklaring',
                            lovhjemmel: undefined,
                            fom: null,
                            tom: null,
                        },
                    ],
                },
            }),
        );

        await waitFor(() =>
            expect(addToastMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: visningenOppdateresToastKey,
                }),
            ),
        );
        await waitFor(() => expect(result.current.isLoading).toBeTruthy());
    });

    it('viser fullført toast og resetter lokale overstyringer når event mottas', async () => {
        (customAxios as unknown as Mock).mockResolvedValue({ data: undefined, status: 204 });
        (useHåndterNyttEvent as Mock).mockImplementation((onNyttEvent: (o: ApiServerSentEvent) => void) => {
            onNyttEvent({
                event: ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE,
                data: null,
            });
        });

        const { result } = renderHook(usePostOverstyrtInntektOgRefusjon);

        await act(() =>
            result.current.postOverstyring({
                aktørId: 'aktørid',
                fødselsnummer: 'fødselsnummer',
                skjæringstidspunkt: '2020-01-01',
                arbeidsgivere: [
                    {
                        begrunnelse: 'begrunnelse',
                        forklaring: 'forklaring',
                        fraMånedligInntekt: 10000,
                        månedligInntekt: 20000,
                        organisasjonsnummer: 'organisasjonsnummer',
                        fraRefusjonsopplysninger: [],
                        refusjonsopplysninger: [],
                        fom: undefined,
                        tom: undefined,
                    },
                ],
                vedtaksperiodeId: VEDTAKSPERIODE_ID,
            }),
        );

        await waitFor(() => {
            expect(slettLokaleOverstyringerMock).toHaveBeenCalled();
        });

        await waitFor(() =>
            expect(addToastMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: visningenErOppdatertToastKey,
                }),
            ),
        );
    });

    it('setter error om REST-overstyringen feiler', async () => {
        (customAxios as unknown as Mock).mockRejectedValue({ response: { status: 500, data: undefined } });
        const { result, rerender } = renderHook(usePostOverstyrtInntektOgRefusjon);

        await act(() =>
            result.current.postOverstyring({
                aktørId: 'aktørid',
                fødselsnummer: 'fødselsnummer',
                skjæringstidspunkt: '2020-01-01',
                arbeidsgivere: [
                    {
                        begrunnelse: 'begrunnelse',
                        forklaring: 'forklaring',
                        fraMånedligInntekt: 10000,
                        månedligInntekt: 20000,
                        organisasjonsnummer: 'en feil',
                        fraRefusjonsopplysninger: [],
                        refusjonsopplysninger: [],
                    },
                ],
                vedtaksperiodeId: VEDTAKSPERIODE_ID,
            }),
        );

        rerender();
        await waitFor(() => expect(result.current.error).not.toBeUndefined());
    });
});
