import { harBeslutteroppgaveForSkjæringstidspunkt } from '@state/totrinnsvurdering';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enTotrinnsvurdering } from '@test-data/totrinnsvurdering';

describe('harBeslutteroppgaveForSkjæringstidspunkt', () => {
    const skjæringstidspunkt = '2024-01-01';
    const periodeMedOppgave = enBeregnetPeriode({ skjaeringstidspunkt: skjæringstidspunkt });
    const person = enPerson({
        arbeidsgivere: [enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [periodeMedOppgave] })] })],
    });
    const beslutteroppgave = enTotrinnsvurdering({ erBeslutteroppgave: true });

    it('gir true når perioden med aktiv oppgave har skjæringstidspunktet og er hos beslutter', () => {
        expect(
            harBeslutteroppgaveForSkjæringstidspunkt(
                person,
                periodeMedOppgave.id,
                beslutteroppgave,
                skjæringstidspunkt,
            ),
        ).toBe(true);
    });

    it('gir false for et annet skjæringstidspunkt', () => {
        expect(
            harBeslutteroppgaveForSkjæringstidspunkt(person, periodeMedOppgave.id, beslutteroppgave, '2024-06-01'),
        ).toBe(false);
    });

    it('gir false når totrinnsvurderingen ikke er hos beslutter', () => {
        expect(
            harBeslutteroppgaveForSkjæringstidspunkt(
                person,
                periodeMedOppgave.id,
                enTotrinnsvurdering({ erBeslutteroppgave: false }),
                skjæringstidspunkt,
            ),
        ).toBe(false);
    });

    it('gir false når ingen periode har aktiv oppgave', () => {
        expect(harBeslutteroppgaveForSkjæringstidspunkt(person, null, beslutteroppgave, skjæringstidspunkt)).toBe(
            false,
        );
    });

    it('gir false uten totrinnsvurdering', () => {
        expect(harBeslutteroppgaveForSkjæringstidspunkt(person, periodeMedOppgave.id, null, skjæringstidspunkt)).toBe(
            false,
        );
    });
});
