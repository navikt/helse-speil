import dayjs from 'dayjs';

import {
    ApiArbeidsforholdoverstyring,
    ApiBeregnetPeriode,
    ApiDagoverstyring,
    ApiInntektoverstyring,
    ApiOverstyring,
    ApiSaksbildePerson,
} from '@io/rest/generated/spesialist.schemas';
import { useActivePeriod } from '@state/periode';
import { isArbeidsforholdoverstyring, isDagoverstyring, isGhostPeriode, isInntektoverstyring } from '@utils/typeguards';

type UseEndringerForPeriodeResult = {
    inntektsendringer: ApiInntektoverstyring[];
    arbeidsforholdendringer: ApiArbeidsforholdoverstyring[];
    dagendringer: ApiDagoverstyring[];
};
export const useEndringerForPeriode = (
    endringer: ApiOverstyring[] | undefined,
    person: ApiSaksbildePerson,
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
        .filter((it) => dayjs((periode as ApiBeregnetPeriode).skjaeringstidspunkt).isSameOrBefore(it.timestamp))
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
