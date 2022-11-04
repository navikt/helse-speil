import { nanoid } from 'nanoid';

import { getOppgavereferanse } from '@state/selectors/period';
import { enOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';

describe('getOppgavereferanse', () => {
    it('returnerer en oppgavereferanse for beregnede perioder som har en oppgave', () => {
        const id = nanoid();
        const oppgave = enOppgave({ id });
        const periode = enBeregnetPeriode({ oppgave });

        expect(getOppgavereferanse(periode)).toEqual(id);
    });

    it('returnerer null for beregnede perioder som ikke har oppgave', () => {
        const periode = enBeregnetPeriode();

        expect(getOppgavereferanse(periode)).toBeNull();
    });

    it('returnerer null for ghostperioder', () => {
        const periode = enGhostPeriode();

        expect(getOppgavereferanse(periode)).toBeNull();
    });
});
