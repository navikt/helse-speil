import dayjs from 'dayjs';

import {
    Arbeidsforholdoverstyring,
    BeregnetPeriodeFragment,
    Dagoverstyring,
    Inntektoverstyring,
    Overstyring,
    PersonFragment,
} from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { isArbeidsforholdoverstyring, isDagoverstyring, isGhostPeriode, isInntektoverstyring } from '@utils/typeguards';

type UseEndringerForPeriodeResult = {
    inntektsendringer: Inntektoverstyring[];
    arbeidsforholdendringer: Arbeidsforholdoverstyring[];
    dagendringer: Dagoverstyring[];
};
export const useEndringerForPeriode = (
    endringer: Array<Overstyring> | undefined,
    person: PersonFragment,
): UseEndringerForPeriodeResult => {
    const periode = useActivePeriod(person);

    if (!endringer || !periode) {
        return {
            inntektsendringer: [],
            arbeidsforholdendringer: [],
            dagendringer: [],
        };
    }

    if (isGhostPeriode(periode)) {
        const arbeidsforhold = endringer
            .filter((it) => dayjs(periode.skjaeringstidspunkt).isSameOrBefore(it.timestamp))
            .filter(isArbeidsforholdoverstyring);

        const inntekter = endringer
            .filter((it) => dayjs(periode.skjaeringstidspunkt).isSameOrBefore(it.timestamp))
            .filter(isInntektoverstyring);

        return {
            inntektsendringer: inntekter,
            arbeidsforholdendringer: arbeidsforhold,
            dagendringer: [],
        };
    }

    const inntekter = endringer
        .filter((it) => dayjs(periode.skjaeringstidspunkt).isSameOrBefore(it.timestamp))
        .filter(isInntektoverstyring);

    const arbeidsforhold = endringer
        .filter((it) => dayjs((periode as BeregnetPeriodeFragment).skjaeringstidspunkt).isSameOrBefore(it.timestamp))
        .filter(isArbeidsforholdoverstyring);

    const dager = endringer
        .filter((it) => dayjs(periode.skjaeringstidspunkt).isSameOrBefore(it.timestamp))
        .filter(isDagoverstyring);

    return {
        inntektsendringer: inntekter,
        arbeidsforholdendringer: arbeidsforhold,
        dagendringer: dager,
    };
};
