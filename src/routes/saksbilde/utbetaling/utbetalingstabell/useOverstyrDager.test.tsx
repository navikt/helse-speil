import { Mock, vi } from 'vitest';

import { ApiGraderteAndreYtelserDag } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { useGetGraderteAndreYtelser } from '@io/rest/generated/andre-ytelser/graderte-andre-ytelser/graderte-andre-ytelser';
import {
    ApiArbeidsgiver,
    ApiKildetype,
    ApiServerSentEvent,
    ApiServerSentEventEvent,
} from '@io/rest/generated/spesialist.schemas';
import { useAktivtInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { visningenOppdateresToastKey } from '@state/oppdateringToasts';
import { useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { enBeregnetPeriode } from '@test-data/periode';
import { renderHook } from '@test-utils';
import { act, waitFor } from '@testing-library/react';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { fetchMock, jsonBody, jsonResponse, mockFetchResponse } from '../../../../../vitest.setup';
import { tilOverstyrteDager, useOverstyrDager } from './useOverstyrDager';

vi.mock('@state/person');
vi.mock('@state/inntektsforhold/inntektsforhold');
vi.mock('@state/toasts');
vi.mock('next/navigation', () => ({ useParams: () => ({ personPseudoId: PSEUDO_ID }) }));
vi.mock('@utils/brukerrolleHooks', () => ({ useErCoachFagkoordinatorEllerSupersaksbehandler: () => true }));
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
const GRADERTE_ANDRE_YTELSER_URL = `/api/andre-ytelser/personer/${PSEUDO_ID}/graderte-andre-ytelser`;

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
                    dager: [
                        {
                            dato: '2020-01-02',
                            andreYtelserGrader: { FORELDREPENGER: 40 },
                            sykdomsgrad: 30,
                            arbeidsgrad: 30,
                            sykdomsgradFørFordeling: 70,
                            begrunnelse: 'Begrunnelse for klyngen',
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

    test('skal fjerne lagret fordeling uten å sende tidslinjen når dagtype og grad er uendret', async () => {
        mockBackend(200, [lagretFordeling]);
        const result = await renderMedLagredeGraderteAndreYtelser();

        const callback = vi.fn();
        await act(() =>
            result.current.postOverstyring(
                [sykedagMedFordeling],
                [{ ...sykedagMedFordeling, gradertAnnenYtelse: null }],
                BEGRUNNELSE,
                PERIODE,
                INNTEKTSFORHOLD,
                callback,
            ),
        );

        expect(postKallTil()).toEqual([GRADERTE_ANDRE_YTELSER_URL]);
        expect(fetchMock).toHaveBeenCalledWith(
            GRADERTE_ANDRE_YTELSER_URL,
            expect.objectContaining({ body: jsonBody(fjerningsrequest) }),
        );
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('skal fjerne lagret fordeling og sende tidslinjen når dagen blir ferie', async () => {
        mockBackend(200, [lagretFordeling]);
        const result = await renderMedLagredeGraderteAndreYtelser();
        const feriedag: Utbetalingstabelldag = {
            ...sykedagMedFordeling,
            dag: oversyrteDager[0]!.dag,
            grad: undefined,
            gradertAnnenYtelse: null,
        };

        await act(() =>
            result.current.postOverstyring([sykedagMedFordeling], [feriedag], BEGRUNNELSE, PERIODE, INNTEKTSFORHOLD),
        );

        expect(postKallTil()).toEqual([GRADERTE_ANDRE_YTELSER_URL, TIDSLINJE_URL]);
        expect(fetchMock).toHaveBeenCalledWith(
            GRADERTE_ANDRE_YTELSER_URL,
            expect.objectContaining({ body: jsonBody(fjerningsrequest) }),
        );
        expect(fetchMock).toHaveBeenCalledWith(
            TIDSLINJE_URL,
            expect.objectContaining({
                body: jsonBody({
                    begrunnelse: BEGRUNNELSE,
                    dager: tilOverstyrteDager([sykedagMedFordeling], [feriedag]),
                }),
            }),
        );
    });

    test('skal overstyre tidslinjen for nye dager selv om de er like dagen i dager-listen', async () => {
        mockBackend();
        const nyDag: Utbetalingstabelldag = { ...dager[0]!, dato: '2019-12-31', erNyDag: true };
        const { result } = renderHook(() => useOverstyrDager());

        await act(() => result.current.postOverstyring([nyDag], [nyDag], BEGRUNNELSE, PERIODE, INNTEKTSFORHOLD));

        expect(postKallTil()).toEqual([TIDSLINJE_URL]);
    });

    test('oppdaterer den nye query-cachen etter lagring', async () => {
        mockBackend();
        const { result } = renderHook(() => ({
            overstyrDager: useOverstyrDager(),
            lagret: useGetGraderteAndreYtelser(PSEUDO_ID),
        }));
        await waitFor(() => expect(result.current.lagret.data?.[0]?.versjon).toBe('versjon-1'));

        await act(() =>
            result.current.overstyrDager.postOverstyring(dager, [gradertDag], BEGRUNNELSE, PERIODE, INNTEKTSFORHOLD),
        );

        await waitFor(() => expect(result.current.lagret.data?.[0]?.versjon).toBe('versjon-2'));
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

    test.each([
        [
            400,
            'GRAD_UTENFOR_GRENSER',
            'Sykdomsgrad og andre ytelser kan til sammen ikke være mer enn 100 %. Sykdomsgraden må være minst 1 og ikke høyere enn før fordeling, og hver ytelse må være mellom 1 og 99.',
        ],
        [400, 'SUM_ER_IKKE_100', 'Sykdomsgrad, arbeidsgrad og andre ytelser må til sammen bli 100 %.'],
        [
            400,
            'ARBEIDSGRAD_OKER',
            'Arbeidsgraden kan ikke øke. Sykdomsgrad og andre ytelser må til sammen være minst like høye som sykdomsgraden før fordeling.',
        ],
        [
            400,
            'YTELSER_MANGLER_TREKK',
            'Sykdomsgraden må være lik sykdomsgraden før fordeling når dagen ikke har andre ytelser.',
        ],
        [400, 'MANGLER_ENDRINGER', 'Det er ingen endringer i fordelingene å lagre.'],
        [403, null, 'Du har ikke tilgang til å endre graderte andre ytelser for denne personen.'],
        [400, 'UKJENT_FEILKODE', 'Feil under sending av overstyring. Prøv igjen senere.'],
    ])('skal gi riktig feilmelding når sp-andre-ytelser svarer %i med %s', async (status, code, feilmelding) => {
        mockBackend(status, [], code);
        const { result } = renderHook(() => useOverstyrDager());

        await act(() => result.current.postOverstyring(dager, [gradertDag], BEGRUNNELSE, PERIODE, INNTEKTSFORHOLD));

        await waitFor(() => expect(result.current.error).toBe(feilmelding));
    });

    test('skal fjerne «visningen oppdateres» og la saksbehandler prøve igjen når lagringen feiler', async () => {
        const { removeToast } = mockToasts();
        mockBackend(400, [], 'SUM_ER_IKKE_100');
        const { result } = renderHook(() => useOverstyrDager());
        const callback = vi.fn();
        function lagre() {
            return act(() =>
                result.current.postOverstyring(dager, [gradertDag], BEGRUNNELSE, PERIODE, INNTEKTSFORHOLD, callback),
            );
        }

        await lagre();

        await waitFor(() => expect(result.current.error).toBeDefined());
        expect(removeToast).toHaveBeenCalledWith(visningenOppdateresToastKey);
        expect(callback).not.toHaveBeenCalled();

        mockBackend();
        await lagre();

        expect(result.current.error).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('skal ikke vente på oppdatering når sp-andre-ytelser svarer med samme versjon', async () => {
        const { addToast, removeToast } = mockToasts();
        mockBackend(200, [], null, 'versjon-1');
        const result = await renderMedLagredeGraderteAndreYtelser();

        const callback = vi.fn();
        await act(() =>
            result.current.postOverstyring(dager, [gradertDag], BEGRUNNELSE, PERIODE, INNTEKTSFORHOLD, callback),
        );

        await waitFor(() => expect(result.current.done).toBe(true));
        expect(removeToast).toHaveBeenCalledWith(visningenOppdateresToastKey);
        expect(addToast).toHaveBeenCalledWith(ALLEREDE_LAGRET_TOAST);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('skal vente på oppdatering når sp-andre-ytelser svarer med ny versjon', async () => {
        const { addToast, removeToast } = mockToasts();
        mockBackend();
        const result = await renderMedLagredeGraderteAndreYtelser();

        await act(() => result.current.postOverstyring(dager, [gradertDag], BEGRUNNELSE, PERIODE, INNTEKTSFORHOLD));

        expect(result.current.done).toBe(false);
        expect(removeToast).not.toHaveBeenCalledWith(visningenOppdateresToastKey);
        expect(addToast).not.toHaveBeenCalledWith(ALLEREDE_LAGRET_TOAST);
    });

    test('skal lagre tidslinjen og vente på oppdatering når fordelingene er uendret', async () => {
        const { addToast, removeToast } = mockToasts();
        mockBackend(200, [], null, 'versjon-1');
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
        expect(result.current.done).toBe(false);
        expect(removeToast).not.toHaveBeenCalledWith(visningenOppdateresToastKey);
        expect(addToast).not.toHaveBeenCalledWith(ALLEREDE_LAGRET_TOAST);
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

function mockBackend(
    graderteAndreYtelserStatus = 200,
    lagredeDager: ApiGraderteAndreYtelserDag[] = [],
    feilkode: string | null = graderteAndreYtelserStatus === 409 ? 'UTDATERT_TILSTAND' : null,
    versjonEtterLagring = 'versjon-2',
) {
    let versjon = 'versjon-1';
    fetchMock.mockImplementation((url, init) => {
        if (url === GRADERTE_ANDRE_YTELSER_URL && init?.method === 'POST') {
            if (graderteAndreYtelserStatus === 200) versjon = versjonEtterLagring;
            return Promise.resolve(
                graderteAndreYtelserStatus === 200
                    ? jsonResponse({ versjon: versjonEtterLagring })
                    : jsonResponse(
                          {
                              type: 'about:blank',
                              status: graderteAndreYtelserStatus,
                              title: 'Feil',
                              code: feilkode,
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
                        versjon,
                        dager: lagredeDager,
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
        lagret: useGetGraderteAndreYtelser(PSEUDO_ID),
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

function mockToasts() {
    const addToast = vi.fn();
    const removeToast = vi.fn();
    (useAddToast as Mock).mockReturnValue(addToast);
    (useRemoveToast as Mock).mockReturnValue(removeToast);
    return { addToast, removeToast };
}

const ALLEREDE_LAGRET_TOAST = expect.objectContaining({ message: 'Fordelingene er allerede lagret' });

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
    dato: '2020-01-02',
    grad: 70,
    gradertAnnenYtelse: {
        sykdomsgrad: 30,
        andreYtelserGrader: { FORELDREPENGER: 40 },
        sykdomsgradFørFordeling: 70,
        begrunnelse: 'Begrunnelse for klyngen',
    },
};
const sykedagMedFordeling: Utbetalingstabelldag = { ...dager[0]!, dato: '2020-01-03', grad: 80 };
const lagretFordeling: ApiGraderteAndreYtelserDag = {
    dato: '2020-01-03',
    andreYtelserGrader: { FORELDREPENGER: 40 },
    sykdomsgrad: 40,
    arbeidsgrad: 20,
    sykdomsgradFørFordeling: 80,
    begrunnelse: 'Lagret begrunnelse',
};
const fjerningsrequest = {
    yrkesaktivitet: 'ARBEIDSTAKER',
    organisasjonsnummer: ORGNUMMER,
    versjon: 'versjon-1',
    behandlingId: BEHANDLING_ID,
    dager: [
        {
            dato: '2020-01-03',
            andreYtelserGrader: {},
            sykdomsgrad: 80,
            arbeidsgrad: 20,
            sykdomsgradFørFordeling: 80,
            begrunnelse: BEGRUNNELSE,
        },
    ],
};
