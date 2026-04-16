import { Mock, vi } from 'vitest';

import { visningenOppdateresToastKey } from '@state/oppdateringToasts';
import { useRemoveToast } from '@state/toasts';
import { renderHook } from '@testing-library/react';

import { useFjernOppdatererToast } from './useFjernOppdatererToast';

vi.mock('@state/toasts', () => ({
    useRemoveToast: vi.fn(),
}));

describe('useFjernOppdateringToast', () => {
    const removeToastMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        (useRemoveToast as Mock).mockReturnValue(removeToastMock);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('skal kalle removeToast med visningenOppdateresToastKey når visningenOppdateres endrer fra true til false', () => {
        const { rerender } = renderHook(({ visningenOppdateres }) => useFjernOppdatererToast(visningenOppdateres), {
            initialProps: { visningenOppdateres: true },
        });

        expect(removeToastMock).not.toHaveBeenCalled();

        rerender({ visningenOppdateres: false });

        expect(removeToastMock).toHaveBeenCalledWith(visningenOppdateresToastKey);
    });
});
