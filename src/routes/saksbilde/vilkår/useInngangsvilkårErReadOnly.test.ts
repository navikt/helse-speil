import { Mock } from 'vitest';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { ApiBeregnetPeriode, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { useTotrinnsvurderingForPeriode } from '@state/totrinnsvurdering';
import { enTotrinnsvurdering } from '@test-data/totrinnsvurdering';
import { renderHook } from '@test-utils';

import { useInngangsvilkårErReadOnly } from './useInngangsvilkårErReadOnly';

vi.mock('@hooks/useIsReadOnlyOppgave', () => ({ useIsReadOnlyOppgave: vi.fn() }));
vi.mock('@state/totrinnsvurdering', () => ({ useTotrinnsvurderingForPeriode: vi.fn() }));

const person = {} as ApiSaksbildePerson;
const periode = {} as ApiBeregnetPeriode;

function erReadOnly(): boolean {
    return renderHook(() => useInngangsvilkårErReadOnly(person, periode)).result.current;
}

describe('useInngangsvilkårErReadOnly', () => {
    beforeEach(() => {
        (useIsReadOnlyOppgave as Mock).mockReturnValue(false);
        (useTotrinnsvurderingForPeriode as Mock).mockReturnValue(null);
    });

    it('kan vurderes når oppgaven ikke er read only og det ikke er en beslutteroppgave', () => {
        (useTotrinnsvurderingForPeriode as Mock).mockReturnValue(enTotrinnsvurdering({ erBeslutteroppgave: false }));
        expect(erReadOnly()).toBe(false);
    });

    it('er read only for beslutter, selv med beslutteroppgavetilgang', () => {
        (useTotrinnsvurderingForPeriode as Mock).mockReturnValue(enTotrinnsvurdering({ erBeslutteroppgave: true }));
        expect(erReadOnly()).toBe(true);
    });

    it('er read only når oppgaven er read only', () => {
        (useIsReadOnlyOppgave as Mock).mockReturnValue(true);
        expect(erReadOnly()).toBe(true);
    });
});
