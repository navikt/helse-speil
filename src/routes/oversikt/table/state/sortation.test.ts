import { act } from 'react';

import { TabType, tabState } from '@oversikt/tabState';
import { renderHook } from '@test-utils';

import { SortKey, useDateSortValue, useSetDatoSortering, useSetSortering, useSorteringValue } from './sortation';

beforeEach(() => {
    localStorage.clear();
});

describe('sortation', () => {
    describe('useSorteringValue', () => {
        it('opprettet er default sortering for til godkjenning tab', () => {
            const { result } = renderHook(() => useSorteringValue(), {
                atomValues: [[tabState, TabType.TilGodkjenning]],
            });
            expect(result.current).toEqual({ orderBy: SortKey.Opprettet, direction: 'ascending' });
        });

        it('opprettet er default sortering for mine oppgaver tab', () => {
            const { result } = renderHook(() => useSorteringValue(), {
                atomValues: [[tabState, TabType.Mine]],
            });
            expect(result.current).toEqual({ orderBy: SortKey.Opprettet, direction: 'ascending' });
        });

        it('opprettet er default sortering for på vent tab', () => {
            const { result } = renderHook(() => useSorteringValue(), {
                atomValues: [[tabState, TabType.Ventende]],
            });
            expect(result.current).toEqual({ orderBy: SortKey.Opprettet, direction: 'ascending' });
        });
    });

    describe('useSetSortering', () => {
        it('toggler sorteringsretning fra ascending til descending og tilbake igjen', () => {
            const { result } = renderHook(() => ({ sort: useSorteringValue(), setSortering: useSetSortering() }), {
                atomValues: [[tabState, TabType.TilGodkjenning]],
            });

            expect(result.current.sort.direction).toBe('ascending');

            act(() => {
                result.current.setSortering(result.current.sort, SortKey.Søker);
            });
            expect(result.current.sort.direction).toBe('descending');

            act(() => {
                result.current.setSortering(result.current.sort, SortKey.Søker);
            });
            expect(result.current.sort.direction).toBe('ascending');
        });

        it('bytter sorteringsnøkkel', () => {
            const { result } = renderHook(() => ({ sort: useSorteringValue(), setSortering: useSetSortering() }), {
                atomValues: [[tabState, TabType.TilGodkjenning]],
            });

            expect(result.current.sort.orderBy).toBe(SortKey.Opprettet);

            act(() => {
                result.current.setSortering(result.current.sort, SortKey.Saksbehandler);
            });

            expect(result.current.sort.orderBy).toBe(SortKey.Saksbehandler);
        });

        it('sortering er uavhengig per tab', () => {
            const { result: tilGodkjenning } = renderHook(
                () => ({ sort: useSorteringValue(), setSortering: useSetSortering() }),
                { atomValues: [[tabState, TabType.TilGodkjenning]] },
            );

            act(() => {
                tilGodkjenning.current.setSortering(tilGodkjenning.current.sort, SortKey.Saksbehandler);
            });

            const { result: mine } = renderHook(() => useSorteringValue(), {
                atomValues: [[tabState, TabType.Mine]],
            });

            expect(tilGodkjenning.current.sort.orderBy).toBe(SortKey.Saksbehandler);
            expect(mine.current.orderBy).toBe(SortKey.Opprettet);
        });
    });

    describe('useDateSortValue', () => {
        it('returnerer default dato-sorteringsnøkkel for til godkjenning', () => {
            const { result } = renderHook(() => useDateSortValue(), {
                atomValues: [[tabState, TabType.TilGodkjenning]],
            });
            expect(result.current).toBe(SortKey.Opprettet);
        });

        it('returnerer default dato-sorteringsnøkkel for på vent', () => {
            const { result } = renderHook(() => useDateSortValue(), {
                atomValues: [[tabState, TabType.Ventende]],
            });
            expect(result.current).toBe(SortKey.Opprettet);
        });

        it('følger sorteringsnøkkel når det sorteres på en dato-kolonne', () => {
            const { result } = renderHook(
                () => ({
                    sort: useSorteringValue(),
                    setSortering: useSetSortering(),
                    datoKey: useDateSortValue(),
                }),
                { atomValues: [[tabState, TabType.TilGodkjenning]] },
            );

            act(() => {
                result.current.setSortering(result.current.sort, SortKey.BehandlingOpprettetTidspunkt);
            });

            expect(result.current.datoKey).toBe(SortKey.BehandlingOpprettetTidspunkt);
        });

        it('beholder valgt dato-felt når det sorteres på en ikke-dato-kolonne', () => {
            const { result } = renderHook(
                () => ({
                    sort: useSorteringValue(),
                    setSortering: useSetSortering(),
                    setDatoSortering: useSetDatoSortering(),
                    datoKey: useDateSortValue(),
                }),
                { atomValues: [[tabState, TabType.TilGodkjenning]] },
            );

            act(() => {
                result.current.setDatoSortering(SortKey.Tidsfrist);
            });
            expect(result.current.datoKey).toBe(SortKey.Tidsfrist);

            act(() => {
                result.current.setSortering(result.current.sort, SortKey.Søker);
            });

            expect(result.current.datoKey).toBe(SortKey.Tidsfrist);
            expect(result.current.sort.orderBy).toBe(SortKey.Søker);
        });
    });

    describe('useSetDatoSortering', () => {
        it('oppdaterer både dato-felt og sortering', () => {
            const { result } = renderHook(
                () => ({
                    sort: useSorteringValue(),
                    setDatoSortering: useSetDatoSortering(),
                    datoKey: useDateSortValue(),
                }),
                { atomValues: [[tabState, TabType.TilGodkjenning]] },
            );

            act(() => {
                result.current.setDatoSortering(SortKey.Tidsfrist);
            });

            expect(result.current.datoKey).toBe(SortKey.Tidsfrist);
            expect(result.current.sort.orderBy).toBe(SortKey.Tidsfrist);
            expect(result.current.sort.direction).toBe('ascending');
        });

        it('resetter sorteringsretning til ascending', () => {
            const { result } = renderHook(
                () => ({
                    sort: useSorteringValue(),
                    setSortering: useSetSortering(),
                    setDatoSortering: useSetDatoSortering(),
                    datoKey: useDateSortValue(),
                }),
                { atomValues: [[tabState, TabType.TilGodkjenning]] },
            );

            // Sett descending retning
            act(() => {
                result.current.setSortering(result.current.sort, SortKey.Opprettet);
            });
            expect(result.current.sort.direction).toBe('descending');

            // Bytt dato-felt via dropdown — retningen resettes
            act(() => {
                result.current.setDatoSortering(SortKey.Tidsfrist);
            });
            expect(result.current.sort.direction).toBe('ascending');
        });
    });
});
