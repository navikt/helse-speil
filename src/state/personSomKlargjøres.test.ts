import { usePersonKlargjøres } from '@state/personSomKlargjøres';
import { enPerson } from '@test-data/person';
import { renderHook } from '@test-utils';
import { act } from '@testing-library/react';

describe('personSomKlargjøres', () => {
    const aktørId = enPerson().aktorId;
    it('tom state når ingen personer klargjøres', () => {
        const { result } = renderHook(() => usePersonKlargjøres());
        expect(result.current.venter).toEqual(false);
        expect(result.current.klargjortAktørId).toEqual(undefined);
    });
    it('venter når person klargjøres for visning', () => {
        const { result } = renderHook(() => usePersonKlargjøres());
        act(() => result.current.venterPåKlargjøring(aktørId));
        expect(result.current.venter).toEqual(true);
    });
});
