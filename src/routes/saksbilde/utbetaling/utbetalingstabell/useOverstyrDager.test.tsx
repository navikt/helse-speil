import { Mock, vi } from 'vitest';

import { Kildetype, OverstyrDagerMutationDocument } from '@io/graphql';
import { ApiOpptegnelse, ApiOpptegnelseType } from '@io/rest/generated/spesialist.schemas';
import { useAktivtInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enPerson } from '@test-data/person';
import { renderHook } from '@test-utils';
import { act, waitFor } from '@testing-library/react';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { tilOverstyrteDager, useOverstyrDager } from './useOverstyrDager';

vi.mock('@state/person');
vi.mock('@state/inntektsforhold/inntektsforhold');
vi.mock('@state/toasts');
vi.mock('@state/opptegnelser', async () => ({
    ...(await vi.importActual('@state/opptegnelser')),
    useHåndterOpptegnelser: vi.fn(),
    useSetOpptegnelserPollingRate: vi.fn(),
}));
vi.mock('@io/graphql/polling');

const AKTØR_ID = 'aktørId';
const FØDSELSNUMMER = 'fødselsnummer';
const ORGNUMMER = '987654321';
const VEDTAKSPERIODE_ID = 'vedtaksperiode';
const BEGRUNNELSE = 'begrunnelse';

describe('useOverstyrDager', () => {
    beforeEach(() => {
        (useAktivtInntektsforhold as Mock).mockReturnValue(enArbeidsgiver({ organisasjonsnummer: ORGNUMMER }));
        (useAddToast as Mock).mockReturnValue(() => {});
        (useRemoveToast as Mock).mockReturnValue(() => {});
        (useSetOpptegnelserPollingRate as Mock).mockReturnValue(() => {});
        (useHåndterOpptegnelser as Mock).mockReturnValue(() => {});
    });

    test('skal ha default verdier ved oppstart', async () => {
        const person = enPerson();
        const { result } = renderHook((initialPerson) => useOverstyrDager(initialPerson, enArbeidsgiver()), {
            mocks,
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
                mocks,
                initialProps: { person, arbeidsgiver },
            },
        );

        const callback = vi.fn();

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

        // Set up mock to trigger opptegnelse callback when hook re-runs after mutation
        (useHåndterOpptegnelser as Mock).mockImplementation((callBack: (o: ApiOpptegnelse) => void) => {
            callBack({
                sekvensnummer: 1,
                type: ApiOpptegnelseType.NY_SAKSBEHANDLEROPPGAVE,
            });
        });

        const { result, rerender } = renderHook(
            (initialPerson) => useOverstyrDager(initialPerson, enArbeidsgiver({ organisasjonsnummer: ORGNUMMER })),
            {
                mocks,
                initialProps: person,
            },
        );

        await act(() => result.current.postOverstyring(dager, oversyrteDager, BEGRUNNELSE, VEDTAKSPERIODE_ID));

        rerender(enPerson());
        await waitFor(() => expect(result.current.done).toBeTruthy());
    });

    test('skal ha error hvis overstyring ikke virker', async () => {
        const person = enPerson({
            aktorId: AKTØR_ID,
            fodselsnummer: FØDSELSNUMMER,
        });
        const { result, rerender } = renderHook(
            (initialPerson) => useOverstyrDager(initialPerson, enArbeidsgiver({ organisasjonsnummer: ORGNUMMER })),
            {
                mocks,
                initialProps: person,
            },
        );

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
        result: {
            errors: [{ message: 'en feil' }],
        },
    },
];
