import { fetchMock, jsonBody, jsonResponse, mockFetchResponse } from '../../../../../vitest.setup';
import { Mock, vi } from 'vitest';

import { useGetGraderteAndreYtelserForPerson } from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import {
    ApiArbeidsgiver,
    ApiKildetype,
    ApiServerSentEvent,
    ApiServerSentEventEvent,
} from '@io/rest/generated/spesialist.schemas';
import { useAktivtInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { enBeregnetPeriode } from '@test-data/periode';
import { renderHook } from '@test-utils';
import { act, waitFor } from '@testing-library/react';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { tilOverstyrteDager, useOverstyrDager } from './useOverstyrDager';
import { Foreldrepengerdag } from './utbetalingstabelldager';

vi.mock('@state/person');
vi.mock('@state/inntektsforhold/inntektsforhold');
vi.mock('@state/toasts');
vi.mock('next/navigation', () => ({ useParams: () => ({ personPseudoId: PSEUDO_ID }) }));
vi.mock('@utils/featureToggles', () => ({ useSkalSeGraderteAndreYtelser: () => true }));
vi.mock('@state/serverSentEvents', async () => ({
    ...(await vi.importActual('@state/serverSentEvents')),
    useHåndterNyttEvent: vi.fn(),
}));

const ORGNUMMER = '987654321';
const VEDTAKSPERIODE_ID = 'vedtaksperiode';
const BEHANDLING_ID = 'behandling';
const PSEUDO_ID = 'pseudo';
const BEGRUNNELSE = 'begrunnelse';
const PERIODE = enBeregnetPeriode({ vedtaksperiodeId: VEDTAKSPERIODE_ID, behandlingId: BEHANDLING_ID });
const INNTEKTSFORHOLD = { organisasjonsnummer: ORGNUMMER, behandlinger: [] } as unknown as ApiArbeidsgiver;
const TIDSLINJE_URL = `/api/spesialist/vedtaksperioder/${VEDTAKSPERIODE_ID}/overstyringer/tidslinje`;
const GRADERTE_ANDRE_YTELSER_URL = `/api/spesialist/personer/${PSEUDO_ID}/graderte-andre-ytelser`;

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
            result.current.postOverstyring(dager, oversyrteDager, BEGRUNNELSE, PERIODE, INNTEKTSFORHOLD, callback),
        );

        expect(fetchMock).toHaveBeenCalledWith(
            TIDSLINJE_URL,
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

        await act(() => result.current.postOverstyring(dager, oversyrteDager, BEGRUNNELSE, PERIODE, INNTEKTSFORHOLD));

        await waitFor(() => expect(result.current.done).toBeTruthy());
    });

    test('skal ha error hvis REST-overstyringen feiler', async () => {
        mockFetchResponse(undefined, 500);
        const { result, rerender } = renderHook(() => useOverstyrDager());

        await act(() => result.current.postOverstyring(dager, oversyrteDager, BEGRUNNELSE, PERIODE, INNTEKTSFORHOLD));

        rerender();
        await waitFor(() => expect(result.current.error).not.toBeUndefined());
    });

    test('skal bare poste graderte andre ytelser når alle endringene er graderte', async () => {
        mockBackend();
        const result = await renderMedLagredeGraderteAndreYtelser();

        const callback = vi.fn();
        await act(() =>
            result.current.postOverstyring(dager, [gradertDag], BEGRUNNELSE, PERIODE, INNTEKTSFORHOLD, callback),
        );

        expect(fetchMock).toHaveBeenCalledWith(
            GRADERTE_ANDRE_YTELSER_URL,
            expect.objectContaining({
                method: 'POST',
                body: jsonBody({
                    yrkesaktivitet: 'ARBEIDSTAKER',
                    organisasjonsnummer: ORGNUMMER,
                    versjon: 'versjon-1',
                    behandlingId: BEHANDLING_ID,
                    notatTilBeslutter: BEGRUNNELSE,
                    dager: [
                        {
                            dato: '2020-01-02',
                            andreYtelserGrader: { FORELDREPENGER: 40 },
                            sykdomsgrad: 30,
                            arbeidsgrad: 30,
                        },
                    ],
                }),
            }),
        );
        expect(fetchMock).not.toHaveBeenCalledWith(TIDSLINJE_URL, expect.anything());
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('skal poste graderte andre ytelser før tidslinjen når endringene er blandet', async () => {
        mockBackend();
        const result = await renderMedLagredeGraderteAndreYtelser();

        await act(() =>
            result.current.postOverstyring(
                dager,
                [gradertDag, ...oversyrteDager],
                BEGRUNNELSE,
                PERIODE,
                INNTEKTSFORHOLD,
            ),
        );

        expect(postKallTil()).toEqual([GRADERTE_ANDRE_YTELSER_URL, TIDSLINJE_URL]);
        expect(fetchMock).toHaveBeenCalledWith(
            TIDSLINJE_URL,
            expect.objectContaining({
                body: jsonBody({ begrunnelse: BEGRUNNELSE, dager: tilOverstyrteDager(dager, oversyrteDager) }),
            }),
        );
    });

    test('skal ikke poste tidslinjen når graderte andre ytelser feiler', async () => {
        mockBackend(500);
        const { result } = renderHook(() => useOverstyrDager());

        const callback = vi.fn();
        await act(() =>
            result.current.postOverstyring(
                dager,
                [gradertDag, ...oversyrteDager],
                BEGRUNNELSE,
                PERIODE,
                INNTEKTSFORHOLD,
                callback,
            ),
        );

        expect(postKallTil()).toEqual([GRADERTE_ANDRE_YTELSER_URL]);
        expect(callback).not.toHaveBeenCalled();
        await waitFor(() => expect(result.current.error).toBe('Feil under sending av overstyring. Prøv igjen senere.'));
    });

    test('skal gi egen feilmelding når graderte andre ytelser er utdatert', async () => {
        mockBackend(409);
        const { result } = renderHook(() => useOverstyrDager());

        await act(() => result.current.postOverstyring(dager, [gradertDag], BEGRUNNELSE, PERIODE, INNTEKTSFORHOLD));

        await waitFor(() =>
            expect(result.current.error).toBe(
                'Graderte andre ytelser er endret siden du åpnet saken. Se over endringene og prøv igjen.',
            ),
        );
    });
});

function mockBackend(graderteAndreYtelserStatus = 200) {
    fetchMock.mockImplementation((url, init) => {
        if (url === GRADERTE_ANDRE_YTELSER_URL && init?.method === 'POST') {
            return Promise.resolve(
                graderteAndreYtelserStatus === 200
                    ? jsonResponse({ versjon: 'versjon-2' })
                    : jsonResponse(
                          {
                              type: 'about:blank',
                              status: graderteAndreYtelserStatus,
                              title: 'Feil',
                              code: graderteAndreYtelserStatus === 409 ? 'UTDATERT_TILSTAND' : null,
                          },
                          graderteAndreYtelserStatus,
                      ),
            );
        }
        if (url === GRADERTE_ANDRE_YTELSER_URL) {
            return Promise.resolve(
                jsonResponse([
                    {
                        yrkesaktivitet: 'ARBEIDSTAKER',
                        organisasjonsnummer: ORGNUMMER,
                        versjon: 'versjon-1',
                        dager: [],
                        events: [],
                    },
                ]),
            );
        }
        return Promise.resolve(jsonResponse(undefined));
    });
}

async function renderMedLagredeGraderteAndreYtelser() {
    const { result } = renderHook(() => ({
        overstyrDager: useOverstyrDager(),
        lagret: useGetGraderteAndreYtelserForPerson(PSEUDO_ID),
    }));
    await waitFor(() => expect(result.current.lagret.isSuccess).toBe(true));
    return {
        get current() {
            return result.current.overstyrDager;
        },
    };
}

function postKallTil() {
    return fetchMock.mock.calls.filter(([, init]) => init?.method === 'POST').map(([url]) => url);
}

const dager: Utbetalingstabelldag[] = [
    {
        dag: {
            overstyrtDagtype: 'Sykedag',
            speilDagtype: 'Syk',
            visningstekst: 'Syk',
        },
        dato: '2020-01-01',
        grad: 100,
        kilde: { id: '1', type: ApiKildetype.SOKNAD },
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
        kilde: { id: '2', type: ApiKildetype.SAKSBEHANDLER },
        erForeldet: false,
        erAGP: false,
        erVentetid: false,
        erAvvist: false,
        erMaksdato: false,
    },
];
const gradertDag: Utbetalingstabelldag = {
    ...dager[0]!,
    dag: Foreldrepengerdag,
    dato: '2020-01-02',
    grad: 70,
    gradertAnnenYtelse: { sykdomsgrad: 30, andreYtelseGrad: 40 },
};
