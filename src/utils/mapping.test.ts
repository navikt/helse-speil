import { enBeregnetPeriode } from '@test-data/periode';
import { getPeriodState, getPeriodStateMedOppgave } from '@utils/mapping';

describe('getPeriodStateMedOppgave', () => {
    it('gir tilGodkjenning når perioden til godkjenning har aktiv oppgave', () => {
        expect(getPeriodStateMedOppgave(enBeregnetPeriode().somErTilGodkjenning(), true)).toEqual('tilGodkjenning');
    });

    it('gir venter når perioden til godkjenning mangler aktiv oppgave', () => {
        expect(getPeriodStateMedOppgave(enBeregnetPeriode().somErTilGodkjenning(), false)).toEqual('venter');
    });

    it('gir samme tilstand som getPeriodState for andre tilstander', () => {
        const periode = enBeregnetPeriode().somErTilRevurdering();
        expect(getPeriodStateMedOppgave(periode, false)).toEqual(getPeriodState(periode));
    });
});
