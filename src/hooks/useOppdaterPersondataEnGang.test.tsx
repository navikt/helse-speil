import { Mock, vi } from 'vitest';

import {
    oppdatererPersondataToastKey,
    useOppdaterPersondata,
} from '@saksbilde/saksbildeMenu/dropdown/useOppdaterPersondata';
import { useFetchPersonQuery } from '@state/person';
import { useRemoveToast } from '@state/toasts';
import { renderHook } from '@testing-library/react';

import { useOppdaterPersondataEnGang } from './useOppdaterPersondataEnGang';

vi.mock('@state/person', () => ({
    useFetchPersonQuery: vi.fn(),
}));

vi.mock('@saksbilde/saksbildeMenu/dropdown/useOppdaterPersondata', () => ({
    useOppdaterPersondata: vi.fn(),
    oppdatererPersondataToastKey: 'oppdaterer-persondata-toast',
}));

vi.mock('@state/toasts', () => ({
    useRemoveToast: vi.fn(),
}));

describe('useOppdaterPersondataEnGang', () => {
    const forespørPersonoppdateringMock = vi.fn();
    const removeToastMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useOppdaterPersondata as Mock).mockReturnValue([forespørPersonoppdateringMock]);
        (useRemoveToast as Mock).mockReturnValue(removeToastMock);
    });

    it('skal kalle forespørPersonoppdatering når fødselsnummer er definert', () => {
        (useFetchPersonQuery as Mock).mockReturnValue({
            data: { person: { fodselsnummer: '12345678901' } },
        });

        renderHook(() => useOppdaterPersondataEnGang());

        expect(forespørPersonoppdateringMock).toHaveBeenCalledWith('12345678901');
        expect(forespørPersonoppdateringMock).toHaveBeenCalledTimes(1);
    });

    it('skal ikke kalle forespørPersonoppdatering når fødselsnummer er undefined', () => {
        (useFetchPersonQuery as Mock).mockReturnValue({
            data: { person: { fodselsnummer: undefined } },
        });

        renderHook(() => useOppdaterPersondataEnGang());

        expect(forespørPersonoppdateringMock).not.toHaveBeenCalled();
    });

    it('skal ikke kalle forespørPersonoppdatering når person er undefined', () => {
        (useFetchPersonQuery as Mock).mockReturnValue({
            data: { person: undefined },
        });

        renderHook(() => useOppdaterPersondataEnGang());

        expect(forespørPersonoppdateringMock).not.toHaveBeenCalled();
    });

    it('skal kalle removeToast ved unmount', () => {
        (useFetchPersonQuery as Mock).mockReturnValue({
            data: { person: { fodselsnummer: '12345678901' } },
        });

        const { unmount } = renderHook(() => useOppdaterPersondataEnGang());

        expect(removeToastMock).not.toHaveBeenCalled();

        unmount();

        expect(removeToastMock).toHaveBeenCalledWith(oppdatererPersondataToastKey);
        expect(removeToastMock).toHaveBeenCalledTimes(1);
    });

    it('skal kalle forespørPersonoppdatering på nytt når fødselsnummer endres', () => {
        (useFetchPersonQuery as Mock).mockReturnValue({
            data: { person: { fodselsnummer: '12345678901' } },
        });

        const { rerender } = renderHook(() => useOppdaterPersondataEnGang());

        expect(forespørPersonoppdateringMock).toHaveBeenCalledWith('12345678901');
        expect(forespørPersonoppdateringMock).toHaveBeenCalledTimes(1);

        (useFetchPersonQuery as Mock).mockReturnValue({
            data: { person: { fodselsnummer: '98765432109' } },
        });

        rerender();

        expect(forespørPersonoppdateringMock).toHaveBeenCalledWith('98765432109');
        expect(forespørPersonoppdateringMock).toHaveBeenCalledTimes(2);
    });

    it('skal bruke siste versjon av forespørPersonoppdatering callback', () => {
        const forespørPersonoppdateringMock1 = vi.fn();
        const forespørPersonoppdateringMock2 = vi.fn();

        (useFetchPersonQuery as Mock).mockReturnValue({
            data: { person: { fodselsnummer: undefined } },
        });
        (useOppdaterPersondata as Mock).mockReturnValue([forespørPersonoppdateringMock1]);

        const { rerender } = renderHook(() => useOppdaterPersondataEnGang());

        (useOppdaterPersondata as Mock).mockReturnValue([forespørPersonoppdateringMock2]);
        rerender();

        (useFetchPersonQuery as Mock).mockReturnValue({
            data: { person: { fodselsnummer: '12345678901' } },
        });
        rerender();

        expect(forespørPersonoppdateringMock1).not.toHaveBeenCalled();
        expect(forespørPersonoppdateringMock2).toHaveBeenCalledWith('12345678901');
    });
});
