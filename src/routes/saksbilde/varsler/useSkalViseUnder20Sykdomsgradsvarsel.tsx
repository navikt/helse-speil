import { GhostPeriode, Periode } from '@io/graphql';
import {
    getOppkuttedePerioder,
    getOverlappendeArbeidsgivere,
    harPeriodeDagerMedUnder20ProsentTotalGrad,
} from '@saksbilde/utbetaling/utbetalingstabell/arbeidstidsvurdering/arbeidstidsvurdering';
import {
    finnAlleInntektsforhold,
    finnOverstyringerForAktivInntektsforhold,
} from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { perioderOverlapper } from '@utils/date';
import { isArbeidsgiver, isMinimumSykdomsgradsoverstyring } from '@utils/typeguards';

export const useSkalViseUnder20SykdomsgradsvarselSomFeil = () => {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const aktivPeriode = useActivePeriod(person);
    const { data: tilkommenResponse } = useHentTilkommenInntektQuery(person?.personPseudoId);
    const tilkommenData = tilkommenResponse?.data;

    if (!person || !aktivPeriode?.skjaeringstidspunkt) return false;

    const overstyringer = finnOverstyringerForAktivInntektsforhold(aktivPeriode, person);
    const overlappendeArbeidsgivere = getOverlappendeArbeidsgivere(person, aktivPeriode);
    const inntektsforhold = finnAlleInntektsforhold(person);
    const delperioder = getOppkuttedePerioder(overlappendeArbeidsgivere, aktivPeriode)?.filter((it) =>
        harPeriodeDagerMedUnder20ProsentTotalGrad(it, inntektsforhold, aktivPeriode.skjaeringstidspunkt),
    );

    const harBlittVurdert: boolean =
        delperioder?.every((dp) =>
            overstyringer
                .filter(isMinimumSykdomsgradsoverstyring)
                .map((overstyring) => [
                    ...overstyring.minimumSykdomsgrad.perioderVurdertIkkeOk,
                    ...overstyring.minimumSykdomsgrad.perioderVurdertOk,
                ])
                .some((overstyringperiode) => overstyringperiode.some((op) => dp.fom === op.fom && dp.tom === op.tom)),
        ) ?? false;

    const sammenlignSkjæringstidspunkt = erPeriodePåSkjæringstidspunkt(aktivPeriode.skjaeringstidspunkt);

    const harFlereArbeidsgiverePåSkjæringstidspunkt =
        inntektsforhold.filter(
            (inntektsforhold) =>
                (inntektsforhold.generasjoner[0]?.perioder.filter(sammenlignSkjæringstidspunkt).length ?? 0) > 0 ||
                (isArbeidsgiver(inntektsforhold) &&
                    inntektsforhold.ghostPerioder.filter(sammenlignSkjæringstidspunkt).filter((it) => !it.deaktivert)
                        .length > 0),
        )?.length > 1 ||
        (tilkommenData?.some((periode) => {
            return periode.inntekter.some((it) => perioderOverlapper(it.periode, aktivPeriode));
        }) ??
            false);

    const alleSammenfallendeDager = inntektsforhold
        .flatMap((ag) => ag.generasjoner[0]?.perioder)
        .filter(
            (periode) =>
                periode?.skjaeringstidspunkt === aktivPeriode.skjaeringstidspunkt && periode.fom === aktivPeriode.fom,
        )
        .flatMap((periode) => periode?.tidslinje);

    const harDagerMedMerEnn0ProsentTotalGrad =
        alleSammenfallendeDager.filter((dag) => (dag?.utbetalingsinfo?.totalGrad ?? 0) > 0).length > 0;

    const harDagerMedUnder20ProsentTotalGrad =
        alleSammenfallendeDager
            .filter((dag) => dag?.sykdomsdagtype === 'SYKEDAG')
            .filter((dag) => (dag?.utbetalingsinfo?.totalGrad ?? 100) < 20).length > 0;

    return (
        harDagerMedUnder20ProsentTotalGrad &&
        harDagerMedMerEnn0ProsentTotalGrad &&
        !harBlittVurdert &&
        harFlereArbeidsgiverePåSkjæringstidspunkt
    );
};

const erPeriodePåSkjæringstidspunkt = (skjæringstidspunkt: string) => (periode: Periode | GhostPeriode) =>
    periode.skjaeringstidspunkt === skjæringstidspunkt;
