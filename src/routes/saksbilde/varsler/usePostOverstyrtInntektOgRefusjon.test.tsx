import { Mock, vi } from 'vitest';

import {
    OpprettAbonnementDocument,
    Opptegnelse,
    Opptegnelsetype,
    OverstyrInntektOgRefusjonMutationDocument,
} from '@io/graphql';
import { kalkulererFerdigToastKey, kalkulererToastKey } from '@state/kalkuleringstoasts';
import { useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useSlettLokaleOverstyringer } from '@state/overstyring';
import { ToastObject, useAddToast, useRemoveToast } from '@state/toasts';
import { renderHook } from '@test-utils';
import { act, waitFor } from '@testing-library/react';

import { usePostOverstyrtInntektOgRefusjon } from './usePostOverstyrtInntektOgRefusjon';

vi.mock('@state/toasts');
vi.mock('@state/opptegnelser', async () => ({
    ...(await vi.importActual('@state/opptegnelser')),
    useHåndterOpptegnelser: vi.fn(),
    useSetOpptegnelserPollingRate: vi.fn(),
}));
vi.mock('@state/overstyring', async () => ({
    ...(await vi.importActual('@state/overstyring')),
    useSlettLokaleOverstyringer: vi.fn(),
}));
vi.mock('@io/graphql/polling');

const addToastMock = vi.fn();
const slettLokaleOverstyringerMock = vi.fn();

describe('usePostOverstyrInntektOgRefusjon', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAddToast as Mock).mockReturnValue((toast: ToastObject) => {
            addToastMock(toast);
        });
        (useRemoveToast as Mock).mockReturnValue(() => {});
        (useHåndterOpptegnelser as Mock).mockReturnValue(() => {});
        (useSetOpptegnelserPollingRate as Mock).mockReturnValue(() => {});
        (useSlettLokaleOverstyringer as Mock).mockReturnValue(slettLokaleOverstyringerMock);
    });

    it('skal ha initial state ved oppstart', () => {
        const { result } = renderHook(usePostOverstyrtInntektOgRefusjon, { mocks });
        const { isLoading, error, timedOut } = result.current;
        expect(isLoading).toBeFalsy();
        expect(error).toBeUndefined();
        expect(timedOut).toBeFalsy();
    });

    it('skal poste overstyring', async () => {
        const { result, rerender } = renderHook(usePostOverstyrtInntektOgRefusjon, { mocks });

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
                vedtaksperiodeId: '123',
            }),
        );

        rerender();

        await waitFor(() =>
            expect(addToastMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: kalkulererToastKey,
                }),
            ),
        );
        await waitFor(() => expect(result.current.isLoading).toBeTruthy());
    });

    it('viser fullført toast når overstyring er ferdig', async () => {
        const { result } = renderHook(usePostOverstyrtInntektOgRefusjon, { mocks });

        (useHåndterOpptegnelser as Mock).mockImplementation((callBack: (o: Opptegnelse) => void) => {
            callBack({
                aktorId: '1',
                sekvensnummer: 1,
                type: Opptegnelsetype.RevurderingFerdigbehandlet,
                payload: '{}',
                __typename: 'Opptegnelse',
            });
        });

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
                vedtaksperiodeId: '123',
            }),
        );

        await waitFor(() =>
            expect(addToastMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: kalkulererFerdigToastKey,
                }),
            ),
        );
        await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    });

    it('setter error om sending av overstyring feiler', async () => {
        const { result, rerender } = renderHook(usePostOverstyrtInntektOgRefusjon, { mocks });

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
                vedtaksperiodeId: '123',
            }),
        );

        rerender();
        const { isLoading, error } = result.current;
        await waitFor(() => expect(isLoading).toBeFalsy());
        await waitFor(() => expect(error).not.toBeNull());
    });

    it('kaller resetLokaleOverstyringer når opptegnelse er ferdig', async () => {
        const { result } = renderHook(usePostOverstyrtInntektOgRefusjon, { mocks });

        (useHåndterOpptegnelser as Mock).mockImplementation((callBack: (o: Opptegnelse) => void) => {
            callBack({
                aktorId: '1',
                sekvensnummer: 1,
                type: Opptegnelsetype.NySaksbehandleroppgave,
                payload: '{}',
                __typename: 'Opptegnelse',
            });
        });

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
                vedtaksperiodeId: '123',
            }),
        );

        await waitFor(() => {
            expect(slettLokaleOverstyringerMock).toHaveBeenCalled();
        });

        await waitFor(() =>
            expect(addToastMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: kalkulererFerdigToastKey,
                }),
            ),
        );
    });
});

const mocks = [
    {
        request: {
            query: OverstyrInntektOgRefusjonMutationDocument,
            variables: {
                overstyring: {
                    aktorId: 'aktørid',
                    arbeidsgivere: [
                        {
                            begrunnelse: 'begrunnelse',
                            forklaring: 'forklaring',
                            fraManedligInntekt: 10000,
                            manedligInntekt: 20000,
                            organisasjonsnummer: 'organisasjonsnummer',
                            fraRefusjonsopplysninger: [],
                            refusjonsopplysninger: [],
                            lovhjemmel: undefined,
                            fom: null,
                            tom: null,
                        },
                    ],
                    fodselsnummer: 'fødselsnummer',
                    skjaringstidspunkt: '2020-01-01',
                    vedtaksperiodeId: '123',
                },
            },
        },
        result: {
            data: {
                __typename: 'Mutation',
                overstyrInntektOgRefusjon: true,
            },
        },
    },
    {
        request: {
            query: OverstyrInntektOgRefusjonMutationDocument,
            variables: {
                overstyring: {
                    aktorId: 'aktørid',
                    arbeidsgivere: [
                        {
                            begrunnelse: 'begrunnelse',
                            forklaring: 'forklaring',
                            fraManedligInntekt: 10000,
                            manedligInntekt: 20000,
                            organisasjonsnummer: 'en feil',
                            fraRefusjonsopplysninger: [],
                            refusjonsopplysninger: [],
                            lovhjemmel: undefined,
                            fom: null,
                            tom: null,
                        },
                    ],
                    fodselsnummer: 'fødselsnummer',
                    skjaringstidspunkt: '2020-01-01',
                    vedtaksperiodeId: '123',
                },
            },
        },
        result: {
            errors: [{ message: 'en feil' }],
        },
    },
    {
        request: {
            query: OpprettAbonnementDocument,
            variables: {
                personidentifikator: 'aktørid',
            },
        },
        result: {
            data: {
                opprettAbonnement: true,
            },
        },
    },
];
