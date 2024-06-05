import { Inntektskilde, VilkarsgrunnlagSpleis } from '@io/graphql';
import { useCurrentArbeidsgiver, usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { getPeriodState } from '@utils/mapping';

import { useVilkårsgrunnlag } from '../sykepengegrunnlag/useVilkårsgrunnlag';

// Forhåpentligvis midlertidig; tar utgangspunkt i periode til godkjenning da varselet kan havne på AUU (som ikke har avviksprosent)
export const useSkalViseAvviksvarselSomFeil = () => {
    const person = useCurrentPerson();
    const arbeidsgiver = useCurrentArbeidsgiver();
    const aktivPeriode = useActivePeriod();
    const periodeTilGodkjenning = usePeriodeTilGodkjenning();
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, periodeTilGodkjenning);
    const harBlittSkjønnsmessigFastsatt =
        vilkårsgrunnlag?.inntekter.find((aginntekt) => aginntekt.arbeidsgiver === arbeidsgiver?.organisasjonsnummer)
            ?.skjonnsmessigFastsatt?.kilde === Inntektskilde.SkjonnsmessigFastsatt;

    return (
        aktivPeriode?.skjaeringstidspunkt === periodeTilGodkjenning?.skjaeringstidspunkt &&
        ((vilkårsgrunnlag as VilkarsgrunnlagSpleis)?.avviksprosent ?? 0) >= 25 &&
        getPeriodState(periodeTilGodkjenning) !== 'tilSkjønnsfastsettelse' &&
        !harBlittSkjønnsmessigFastsatt
    );
};
