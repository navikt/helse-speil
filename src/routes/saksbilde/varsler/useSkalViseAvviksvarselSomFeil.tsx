import { Inntektskilde, VilkarsgrunnlagSpleisV2 } from '@io/graphql';
import { useAktivtInntektsforhold } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { finnPeriodeTilGodkjenning } from '@state/selectors/arbeidsgiver';
import { getPeriodState } from '@utils/mapping';
import { isArbeidsgiver } from '@utils/typeguards';

import { useVilkårsgrunnlag } from '../sykepengegrunnlag/useVilkårsgrunnlag';

// Forhåpentligvis midlertidig; tar utgangspunkt i periode til godkjenning da varselet kan havne på AUU (som ikke har avviksprosent)
export const useSkalViseAvviksvarselSomFeil = () => {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const inntektsforhold = useAktivtInntektsforhold(person);
    const aktivPeriode = useActivePeriod(person);
    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, periodeTilGodkjenning);
    const harBlittSkjønnsmessigFastsatt =
        vilkårsgrunnlag?.inntekter.find(
            (aginntekt) =>
                isArbeidsgiver(inntektsforhold) && aginntekt.arbeidsgiver === inntektsforhold?.organisasjonsnummer,
        )?.skjonnsmessigFastsatt?.kilde === Inntektskilde.SkjonnsmessigFastsatt;

    return (
        aktivPeriode?.skjaeringstidspunkt === periodeTilGodkjenning?.skjaeringstidspunkt &&
        Number((vilkårsgrunnlag as VilkarsgrunnlagSpleisV2)?.avviksvurdering?.avviksprosent ?? 0) >= 25 &&
        getPeriodState(periodeTilGodkjenning) !== 'tilSkjønnsfastsettelse' &&
        !harBlittSkjønnsmessigFastsatt
    );
};
