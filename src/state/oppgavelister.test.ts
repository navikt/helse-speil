import { beforeEach, describe, expect, it, vi } from 'vitest';

import { act, renderHook } from '@test-utils';

import { useOppgavelisteFeed, useOppgavelisteSokSkjema, useSubmitOppgavelisteSok } from './oppgavelister';

const useGetOppgaverMock = vi.fn((_params: Record<string, unknown>, _options?: { query?: { enabled?: boolean } }) => ({
    data: undefined,
    error: null,
    isFetching: false,
}));

vi.mock('@io/rest/generated/oppgaver/oppgaver', () => ({
    useGetOppgaver: (params: Record<string, unknown>, options?: { query?: { enabled?: boolean } }) =>
        useGetOppgaverMock(params, options),
}));

const enabledKall = () =>
    useGetOppgaverMock.mock.calls.filter(([, options]) => options?.query?.enabled === true).map(([params]) => params);

const renderOppgavelisteHooks = () =>
    renderHook(() => ({
        feed: useOppgavelisteFeed(),
        skjema: useOppgavelisteSokSkjema(),
        submit: useSubmitOppgavelisteSok(),
    }));

describe('oppgavelister', () => {
    beforeEach(() => {
        sessionStorage.clear();
        useGetOppgaverMock.mockClear();
    });

    it('kjører ingen spørring før brukeren har submittet søket', () => {
        const { result } = renderOppgavelisteHooks();

        act(() => result.current.skjema.setOppgavelisteId('restanseteam-frilans'));
        act(() => result.current.skjema.setOppgaveKlarFom('2026-01-01'));

        expect(enabledKall()).toHaveLength(0);
        expect(result.current.feed.aktivOppgaveliste).toBeNull();
    });
    it('bruker valgt liste og datofilter først når søket submittes', () => {
        const { result } = renderOppgavelisteHooks();

        act(() => result.current.skjema.setOppgavelisteId('restanseteam-frilans'));
        act(() => result.current.skjema.setOppgaveKlarFom('2026-01-01'));
        act(() => result.current.skjema.setOppgaveKlarTom('2026-02-01'));
        act(() => result.current.skjema.setBehandlingOpprettetFom('2026-03-01'));
        act(() => result.current.skjema.setBehandlingOpprettetTom('2026-04-01'));
        act(() => result.current.submit());

        const kall = enabledKall();
        expect(kall.length).toBeGreaterThan(0);
        expect(kall.at(-1)).toMatchObject({
            oppgaveKlarFom: '2026-01-01',
            oppgaveKlarTom: '2026-02-01',
            behandlingOpprettetFom: '2026-03-01',
            behandlingOpprettetTom: '2026-04-01',
            sidetall: 1,
        });
        expect(result.current.feed.aktivOppgaveliste?.id).toBe('restanseteam-frilans');
    });

    it('spør med uendrede parametre når skjemaet endres etter et submittet søk', () => {
        const { result } = renderOppgavelisteHooks();

        act(() => result.current.skjema.setOppgavelisteId('restanseteam-frilans'));
        act(() => result.current.submit());
        const etterSubmit = enabledKall().at(-1);

        act(() => result.current.skjema.setOppgaveKlarFom('2026-05-05'));
        act(() => result.current.skjema.setBehandlingOpprettetFom('2026-06-06'));

        expect(enabledKall().at(-1)).toEqual(etterSubmit);
    });
});
