import { getFørstePeriodeForSkjæringstidspunkt } from '@saksbilde/historikk/mapping';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enGhostPeriode } from '@test-data/periode';

describe('mapping', () => {
    describe('getFørstePeriodeForSkjæringstidspunkt', () => {
        test('Finner første periode for skjæringstidspunkt', async () => {
            const behandling = enBehandling();
            const arbeidsgiver = enArbeidsgiver({ behandlinger: [behandling] });
            const skjæringstidspunkt = behandling.perioder[0]?.skjaeringstidspunkt as string;
            const førstePeriodeForSkjæringstidspunkt = getFørstePeriodeForSkjæringstidspunkt(
                skjæringstidspunkt,
                arbeidsgiver,
            );

            expect(førstePeriodeForSkjæringstidspunkt?.id).toEqual(behandling.perioder[0]?.id);
        });

        test('Takler arbeidsgivere uten sykefravær', async () => {
            const behandling = enBehandling();
            const arbeidsgiver = enArbeidsgiver({ behandlinger: [], ghostPerioder: [enGhostPeriode()] });
            const skjæringstidspunkt = behandling.perioder[0]?.skjaeringstidspunkt as string;
            const førstePeriodeForSkjæringstidspunkt = getFørstePeriodeForSkjæringstidspunkt(
                skjæringstidspunkt,
                arbeidsgiver,
            );

            expect(førstePeriodeForSkjæringstidspunkt).toBeUndefined();
        });
    });
});
