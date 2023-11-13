import { RecoilWrapper } from '@test-wrappers';
import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { OpprettAbonnementDocument, OverstyrInntektOgRefusjonMutationDocument } from '@io/graphql';
import { kalkulererFerdigToastKey, kalkulererToastKey } from '@state/kalkuleringstoasts';
import { useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { ToastObject, useAddToast, useRemoveToast } from '@state/toasts';
import { renderHook, waitFor } from '@testing-library/react';

import { usePostOverstyrtInntektOgRefusjon } from './usePostOverstyrtInntektOgRefusjon';

jest.mock('@state/toasts');
jest.mock('@state/opptegnelser', () => ({
    ...jest.requireActual('@state/opptegnelser'),
    useHåndterOpptegnelser: jest.fn(),
    useSetOpptegnelserPollingRate: jest.fn(),
}));
jest.mock('@io/http');

const addToastMock = jest.fn();
(useAddToast as jest.Mock).mockReturnValue((toast: ToastObject) => {
    addToastMock(toast);
});
(useRemoveToast as jest.Mock).mockReturnValue(() => {});
(useHåndterOpptegnelser as jest.Mock).mockReturnValue(() => {});
(useSetOpptegnelserPollingRate as jest.Mock).mockReturnValue(() => {});

describe('usePostOverstyrInntektOgRefusjon', () => {
    it('skal ha initial state ved oppstart', () => {
        const { result } = renderHook(usePostOverstyrtInntektOgRefusjon, {
            wrapper: ({ children }) => (
                <MockedProvider mocks={mocks}>
                    <RecoilWrapper>{children}</RecoilWrapper>
                </MockedProvider>
            ),
        });
        const { isLoading, error, timedOut } = result.current;
        expect(isLoading).toBeFalsy();
        expect(error).toBeUndefined();
        expect(timedOut).toBeFalsy();
    });

    it('skal poste overstyring', async () => {
        const { result, rerender } = renderHook(usePostOverstyrtInntektOgRefusjon, {
            wrapper: ({ children }) => (
                <MockedProvider mocks={mocks}>
                    <RecoilWrapper>{children}</RecoilWrapper>
                </MockedProvider>
            ),
        });
        await result.current.postOverstyring({
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
                },
            ],
        });

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
        const { result, rerender } = renderHook(usePostOverstyrtInntektOgRefusjon, {
            wrapper: ({ children }) => (
                <MockedProvider mocks={mocks}>
                    <RecoilWrapper>{children}</RecoilWrapper>
                </MockedProvider>
            ),
        });
        await result.current.postOverstyring({
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
                },
            ],
        });
        rerender();

        (useHåndterOpptegnelser as jest.Mock).mockImplementation((callBack: (o: Opptegnelse) => void) => {
            callBack({
                aktørId: 1,
                sekvensnummer: 1,
                type: 'REVURDERING_FERDIGBEHANDLET',
                payload: '{}',
            });
        });

        rerender();

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
        const { result, rerender } = renderHook(usePostOverstyrtInntektOgRefusjon, {
            wrapper: ({ children }) => (
                <MockedProvider mocks={mocks}>
                    <RecoilWrapper>{children}</RecoilWrapper>
                </MockedProvider>
            ),
        });

        const { postOverstyring } = result.current;
        await postOverstyring({
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
        });

        rerender();
        const { isLoading, error } = result.current;
        await waitFor(() => expect(isLoading).toBeFalsy());
        await waitFor(() => expect(error).not.toBeNull());
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
                        },
                    ],
                    fodselsnummer: 'fødselsnummer',
                    skjaringstidspunkt: '2020-01-01',
                },
            },
        },
        result: {
            data: {
                overstyrArbeidsforhold: true,
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
                        },
                    ],
                    fodselsnummer: 'fødselsnummer',
                    skjaringstidspunkt: '2020-01-01',
                },
            },
        },
        error: Error('en feil'),
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
