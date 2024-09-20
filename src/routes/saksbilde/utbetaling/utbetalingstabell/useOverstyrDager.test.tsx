import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { Kildetype, OpprettAbonnementDocument, OverstyrDagerMutationDocument } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enPerson } from '@test-data/person';
import { RecoilWrapper } from '@test-wrappers';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { tilOverstyrteDager, useOverstyrDager } from './useOverstyrDager';

jest.mock('@state/person');
jest.mock('@state/arbeidsgiver');
jest.mock('@state/toasts');
jest.mock('@state/opptegnelser');
jest.mock('@io/graphql/polling');

const AKTØR_ID = 'aktørId';
const FØDSELSNUMMER = 'fødselsnummer';
const ORGNUMMER = '987654321';
const VEDTAKSPERIODE_ID = 'vedtaksperiode';
const BEGRUNNELSE = 'begrunnelse';

(useCurrentArbeidsgiver as jest.Mock).mockReturnValue({
    organisasjonsnummer: ORGNUMMER,
});

(useAddToast as jest.Mock).mockReturnValue(() => {});
(useRemoveToast as jest.Mock).mockReturnValue(() => {});
(useSetOpptegnelserPollingRate as jest.Mock).mockReturnValue(() => {});

describe('useOverstyrDager', () => {
    test('skal ha default verdier ved oppstart', async () => {
        const person = enPerson();
        const { result } = renderHook((initialPerson) => useOverstyrDager(initialPerson, enArbeidsgiver()), {
            wrapper: ({ children }) => (
                <MockedProvider mocks={mocks}>
                    <RecoilWrapper>{children}</RecoilWrapper>
                </MockedProvider>
            ),
            initialProps: person,
        });
        expect(result.current.error).toBe(undefined);
        expect(result.current.timedOut).toBe(false);
        expect(result.current.done).toBe(false);
    });
    test('skal ha kalle callback etter posting av korrekt overstyring', async () => {
        const person = enPerson({
            aktorId: AKTØR_ID,
            fodselsnummer: FØDSELSNUMMER,
        });
        const arbeidsgiver = enArbeidsgiver({ organisasjonsnummer: ORGNUMMER });
        const { result, rerender } = renderHook(
            (initialProps) => useOverstyrDager(initialProps.person, initialProps.arbeidsgiver),
            {
                wrapper: ({ children }) => (
                    <MockedProvider mocks={mocks}>
                        <RecoilWrapper>{children}</RecoilWrapper>
                    </MockedProvider>
                ),
                initialProps: { person, arbeidsgiver },
            },
        );

        const callback = jest.fn();

        await act(() =>
            result.current.postOverstyring(dager, oversyrteDager, BEGRUNNELSE, VEDTAKSPERIODE_ID, callback),
        );

        rerender({ person, arbeidsgiver });

        await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));
    });
    test('skal ha done lik true etter person er oppdatert', async () => {
        const person = enPerson({
            aktorId: AKTØR_ID,
            fodselsnummer: FØDSELSNUMMER,
        });
        const { result, rerender } = renderHook((initialPerson) => useOverstyrDager(initialPerson, enArbeidsgiver()), {
            wrapper: ({ children }) => (
                <MockedProvider mocks={mocks}>
                    <RecoilWrapper>{children}</RecoilWrapper>
                </MockedProvider>
            ),
            initialProps: person,
        });

        await act(() => result.current.postOverstyring(dager, oversyrteDager, BEGRUNNELSE, VEDTAKSPERIODE_ID));

        rerender(enPerson());
        await waitFor(() => expect(result.current.done).toBeTruthy());
    });
    test('skal ha error hvis ovberstyring ikke virker', async () => {
        const person = enPerson({
            aktorId: AKTØR_ID,
            fodselsnummer: FØDSELSNUMMER,
        });
        const { result, rerender } = renderHook((initialPerson) => useOverstyrDager(initialPerson, enArbeidsgiver()), {
            wrapper: ({ children }) => (
                <MockedProvider mocks={mocks}>
                    <RecoilWrapper>{children}</RecoilWrapper>
                </MockedProvider>
            ),
            initialProps: person,
        });

        await act(() => result.current.postOverstyring([], [], BEGRUNNELSE, 'en feil'));

        rerender(person);
        await waitFor(() => expect(result.current.error).not.toBeNull());
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
        erAvvist: false,
        erMaksdato: false,
    },
];
const mocks = [
    {
        request: {
            query: OverstyrDagerMutationDocument,
            variables: {
                overstyring: {
                    aktorId: AKTØR_ID,
                    fodselsnummer: FØDSELSNUMMER,
                    organisasjonsnummer: ORGNUMMER,
                    dager: tilOverstyrteDager(dager, oversyrteDager),
                    begrunnelse: BEGRUNNELSE,
                    vedtaksperiodeId: VEDTAKSPERIODE_ID,
                },
            },
        },
        result: {
            data: {
                overstyrDager: true,
            },
        },
    },
    {
        request: {
            query: OverstyrDagerMutationDocument,
            variables: {
                overstyring: {
                    aktorId: AKTØR_ID,
                    fodselsnummer: FØDSELSNUMMER,
                    organisasjonsnummer: ORGNUMMER,
                    dager: [],
                    begrunnelse: BEGRUNNELSE,
                    vedtaksperiodeId: 'en feil',
                },
            },
        },
        error: new Error('en feil'),
    },
    {
        request: {
            query: OpprettAbonnementDocument,
            variables: {
                personidentifikator: AKTØR_ID,
            },
        },
        result: {
            data: {
                opprettAbonnement: true,
            },
        },
    },
];
