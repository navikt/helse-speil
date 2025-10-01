import {
    getOppkuttedePerioder,
    getOverlappendeArbeidsgivere,
    harPeriodeDagerMedUnder20ProsentTotalGrad,
} from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/minimumSykdomsgrad';
import { finnOverstyringerForAktivInntektskilde } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { ActivePeriod } from '@typer/shared';
import { isMinimumSykdomsgradsoverstyring } from '@utils/typeguards';

export const useSkalViseUnder20SykdomsgradsvarselSomFeil = () => {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const aktivPeriode = useActivePeriod(person);

    if (!person || !aktivPeriode?.skjaeringstidspunkt) return false;

    const overstyringer = finnOverstyringerForAktivInntektskilde(aktivPeriode, person);
    const overlappendeArbeidsgivere = getOverlappendeArbeidsgivere(person, aktivPeriode);
    const delperioder = getOppkuttedePerioder(overlappendeArbeidsgivere, aktivPeriode)?.filter((it) =>
        harPeriodeDagerMedUnder20ProsentTotalGrad(it, person.arbeidsgivere, aktivPeriode.skjaeringstidspunkt),
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
        person.arbeidsgivere.filter(
            (it) =>
                (it.generasjoner[0]?.perioder.filter(sammenlignSkjæringstidspunkt).length ?? 0) > 0 ||
                it.ghostPerioder.filter(sammenlignSkjæringstidspunkt).filter((it) => !it.deaktivert).length > 0,
        )?.length > 1;

    const alleSammenfallendeDager = person.arbeidsgivere
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

const erPeriodePåSkjæringstidspunkt = (skjæringstidspunkt: string) => (periode: ActivePeriod) =>
    periode.skjaeringstidspunkt === skjæringstidspunkt;
