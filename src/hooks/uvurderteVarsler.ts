import dayjs from 'dayjs';

import { ArbeidsgiverFragment, BeregnetPeriodeFragment, PersonFragment, Varselstatus } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { DatePeriod } from '@typer/shared';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

export const useUvurderteVarslerPåPeriode = (
    periode: BeregnetPeriodeFragment | DatePeriod,
    person: PersonFragment,
): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver(person);

    if ((!isBeregnetPeriode(periode) && !isUberegnetPeriode(periode)) || !arbeidsgiver) {
        return false;
    }

    return periode.varsler
        .filter((varsel) => !varsel.kode.startsWith('SB_BO_'))
        .some(
            (varsel) =>
                varsel.vurdering?.status !== Varselstatus.Vurdert && varsel.vurdering?.status !== Varselstatus.Godkjent,
        );
};

export const useHarUvurderteVarslerPåEllerFør = (
    activePeriod: BeregnetPeriodeFragment,
    arbeidsgivere: ArbeidsgiverFragment[],
): boolean => {
    return arbeidsgivere
        .filter((arbeidsgivere) => arbeidsgivere.generasjoner.length > 0)
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder)
        .filter((periode) => dayjs(periode?.tom).isSameOrBefore(dayjs(activePeriod.tom)))
        .some((periode) => {
            if (!isBeregnetPeriode(periode) && !isUberegnetPeriode(periode)) return false;
            return periode.varsler
                .filter((varsel) => !varsel.kode.startsWith('SB_BO_'))
                .some(
                    (varsel) =>
                        varsel.vurdering?.status !== Varselstatus.Vurdert &&
                        varsel.vurdering?.status !== Varselstatus.Godkjent,
                );
        });
};
