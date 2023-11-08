import { RecoilWrapper } from '@test-wrappers';
import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { OverstyrInntektOgRefusjonMutationDocument } from '@io/graphql';
import { postAbonnerPåAktør } from '@io/http';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { renderHook, waitFor } from '@testing-library/react';

import { usePostOverstyrtInntektOgRefusjon } from './usePostOverstyrtInntektOgRefusjon';

jest.mock('@state/toasts');
jest.mock('@state/opptegnelser');
jest.mock('@io/http');

const addToastMock = jest.fn();

(useAddToast as jest.Mock).mockReturnValue(() => {
    addToastMock();
});

(useRemoveToast as jest.Mock).mockReturnValue(() => {
    //do nothing
});
(useOpptegnelser as jest.Mock).mockReturnValue(() => {
    //do nothing
});
(useSetOpptegnelserPollingRate as jest.Mock).mockReturnValue(() => {
    //do nothing
});

(postAbonnerPåAktør as jest.Mock).mockReturnValue(Promise.resolve());

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
        const { result } = renderHook(usePostOverstyrtInntektOgRefusjon, {
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
        await waitFor(() => expect(addToastMock).toHaveBeenCalled());
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

        (useOpptegnelser as jest.Mock).mockReturnValue(() => ({
            aktørId: 1,
            sekvensnummer: 1,
            type: 'REVURDERING_FERDIGBEHANDLET',
            payload: '{}',
        }));

        rerender();

        await waitFor(() => expect(addToastMock).toHaveBeenCalled());
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
];
