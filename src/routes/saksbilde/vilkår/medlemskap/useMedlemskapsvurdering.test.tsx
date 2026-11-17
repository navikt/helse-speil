import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger';
import { ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { visningenErOppdatertToastKey, visningenOppdateresToastKey } from '@state/oppdateringToasts';
import { useToasts } from '@state/toasts';
import { useVisningenOppdateresValue } from '@state/visningenOppdateres';
import { act, renderHook } from '@test-utils';

import { useMedlemskapsvurdering } from './useMedlemskapsvurdering';

const serverSentEventMock = vi.hoisted(() => ({
    onEvent: undefined as ((event: { event: string; data: null }) => void) | undefined,
}));

vi.mock('@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: vi.fn(),
}));

vi.mock('@state/serverSentEvents', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/serverSentEvents')>()),
    useHåndterNyttEvent: (onEvent: (event: { event: string; data: null }) => void) => {
        serverSentEventMock.onEvent = onEvent;
    },
}));

beforeEach(() => {
    (useGetVilkårsvurderingerForPersonBehandler as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
    });
});

describe('useMedlemskapsvurdering', () => {
    it('sperrer visningen etter overstyring til spleis har laget ny oppgave', () => {
        const { result } = renderHook(() => ({
            medlemskap: useMedlemskapsvurdering('pseudo-id', 'vurdering-1'),
            visningenOppdateres: useVisningenOppdateresValue(),
            toasts: useToasts(),
        }));

        expect(result.current.visningenOppdateres).toBe(false);

        act(() => result.current.medlemskap.onOverstyrt('vurdering-2'));

        expect(result.current.visningenOppdateres).toBe(true);
        expect(result.current.toasts.map((it) => it.key)).toContain(visningenOppdateresToastKey);

        act(() =>
            serverSentEventMock.onEvent?.({ event: ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE, data: null }),
        );

        expect(result.current.visningenOppdateres).toBe(false);
        expect(result.current.toasts.map((it) => it.key)).toContain(visningenErOppdatertToastKey);
        expect(result.current.toasts.map((it) => it.key)).not.toContain(visningenOppdateresToastKey);
    });
});
