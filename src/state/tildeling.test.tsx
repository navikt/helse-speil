import { Mock } from 'vitest';

import { getGetAntallOppgaverQueryKey, getGetOppgaverQueryKey } from '@io/rest/generated/oppgaver/oppgaver';
import { useDeleteTildeling, usePutTildeling } from '@io/rest/generated/personer/personer';
import { QueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@test-utils';

import { useAvmeld, useTildel } from './tildeling';

vi.mock('@io/rest/generated/personer/personer');

describe('tildeling', () => {
    const mutate = vi.fn();
    let invalidateQueries: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        mutate.mockReset();
        (usePutTildeling as Mock).mockReturnValue({ mutate, isPending: false });
        (useDeleteTildeling as Mock).mockReturnValue({ mutate, isPending: false });
        invalidateQueries = vi.spyOn(QueryClient.prototype, 'invalidateQueries');
    });

    afterEach(() => {
        invalidateQueries.mockRestore();
    });

    it('invaliderer oppgavelista og antall oppgaver når tildeling er utført', async () => {
        const onUtført = vi.fn();
        const { result } = renderHook(() => useTildel());

        await act(() => result.current[0]('en-person', onUtført));
        act(() => hentOnSettled()());

        forventInvaliderteOppgaver();
        expect(onUtført).toHaveBeenCalled();
    });

    it('invaliderer oppgavelista og antall oppgaver når avmelding er utført', async () => {
        const { result } = renderHook(() => useAvmeld());

        await act(() => result.current[0]('en-person'));
        act(() => hentOnSettled()());

        forventInvaliderteOppgaver();
    });

    function hentOnSettled(): () => void {
        const [, options] = mutate.mock.calls[0]!;
        return options.onSettled;
    }

    function forventInvaliderteOppgaver() {
        expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: getGetOppgaverQueryKey() });
        expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: getGetAntallOppgaverQueryKey() });
    }
});
