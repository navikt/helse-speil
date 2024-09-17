import { getFørstePeriodeForSkjæringstidspunkt } from '@saksbilde/historikk/mapping';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enGenerasjon } from '@test-data/generasjon';

describe('mapping', () => {
    describe('getFørstePeriodeForSkjæringstidspunkt', () => {
        test('Finner første periode for skjæringstidspunkt', async () => {
            const generasjon = enGenerasjon();
            const arbeidsgiver = enArbeidsgiver({ generasjoner: [generasjon] });
            const skjæringstidspunkt = generasjon.perioder[0].skjaeringstidspunkt;
            const førstePeriodeForSkjæringstidspunkt = getFørstePeriodeForSkjæringstidspunkt(
                skjæringstidspunkt,
                arbeidsgiver,
            );

            expect(førstePeriodeForSkjæringstidspunkt?.id).toEqual(generasjon.perioder[0].id);
        });
    });
});