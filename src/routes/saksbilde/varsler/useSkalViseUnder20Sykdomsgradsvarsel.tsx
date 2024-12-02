import { useBrukerGrupper, useBrukerIdent } from '@auth/brukerContext';
import {
    getOppkuttedePerioder,
    getOverlappendeArbeidsgivere,
    harPeriodeDagerMedUnder20ProsentTotalGrad,
} from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/minimumSykdomsgrad';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { ActivePeriod } from '@typer/shared';
import { kanOverstyreMinimumSykdomsgradToggle } from '@utils/featureToggles';
import { isMinimumSykdomsgradsoverstyring } from '@utils/typeguards';

export const useSkalViseUnder20SykdomsgradsvarselSomFeil = () => {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const arbeidsgiver = useCurrentArbeidsgiver(person);
    const aktivPeriode = useActivePeriod(person);
    const saksbehandlerident = useBrukerIdent();
    const grupper = useBrukerGrupper();

    if (!person || !aktivPeriode?.skjaeringstidspunkt) return false;

    const overlappendeArbeidsgivere = getOverlappendeArbeidsgivere(person, aktivPeriode);
    const delperioder = getOppkuttedePerioder(overlappendeArbeidsgivere, aktivPeriode)?.filter((it) =>
        harPeriodeDagerMedUnder20ProsentTotalGrad(it, person.arbeidsgivere, aktivPeriode.skjaeringstidspunkt),
    );

    const harBlittVurdert: boolean =
        delperioder?.every((dp) =>
            arbeidsgiver?.overstyringer
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
        alleSammenfallendeDager.filter((dag) => (dag?.utbetalingsinfo?.totalGrad ?? 100) < 20).length > 0;

    return (
        harDagerMedUnder20ProsentTotalGrad &&
        harDagerMedMerEnn0ProsentTotalGrad &&
        !harBlittVurdert &&
        harFlereArbeidsgiverePåSkjæringstidspunkt &&
        kanOverstyreMinimumSykdomsgradToggle(saksbehandlerident, grupper)
    );
};

const erPeriodePåSkjæringstidspunkt = (skjæringstidspunkt: string) => (periode: ActivePeriod) =>
    periode.skjaeringstidspunkt === skjæringstidspunkt;
