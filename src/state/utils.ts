import dayjs, { Dayjs } from 'dayjs';

import {
    ApiArbeidsgiverinntekt,
    ApiSaksbildePerson,
    ApiVilkårsgrunnlagInfotrygdV2,
    ApiVilkårsgrunnlagSpleisV2,
} from '@io/rest/generated/spesialist.schemas';
import { getRequiredTimestamp, isGodkjent } from '@state/selectors/utbetaling';
import { DateString } from '@typer/shared';
import { isBeregnetPeriode } from '@utils/typeguards';

export const getActiveInntekt = (
    vilkårsgrunnlag: ApiVilkårsgrunnlagSpleisV2 | ApiVilkårsgrunnlagInfotrygdV2,
    organisasjonsnummer: string,
): ApiArbeidsgiverinntekt =>
    vilkårsgrunnlag.inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer) ?? vilkårsgrunnlag.inntekter[0]!;

export const getVilkårsgrunnlag = (
    person: ApiSaksbildePerson,
    grunnlagId?: string | null,
): ApiVilkårsgrunnlagSpleisV2 | ApiVilkårsgrunnlagInfotrygdV2 | null => {
    return person.vilkarsgrunnlagV2.find(({ id }) => id === grunnlagId) ?? null;
};

export const getRequiredVilkårsgrunnlag = (
    person: ApiSaksbildePerson,
    grunnlagId?: string | null,
): ApiVilkårsgrunnlagSpleisV2 | ApiVilkårsgrunnlagInfotrygdV2 => {
    return (
        getVilkårsgrunnlag(person, grunnlagId) ??
        (() => {
            throw Error('Fant ikke vilkårsgrunnlag');
        })()
    );
};

export const getLatestUtbetalingTimestamp = (person: ApiSaksbildePerson, after: DateString = '1970-01-01'): Dayjs => {
    let latest: Dayjs = dayjs(after);

    for (const arbeidsgiver of person.arbeidsgivere) {
        for (const periode of arbeidsgiver.behandlinger[0]?.perioder ?? []) {
            if (isBeregnetPeriode(periode) && isGodkjent(periode.utbetaling)) {
                latest = dayjs.max(dayjs(getRequiredTimestamp(periode.utbetaling)), latest) as Dayjs;
            }
        }
    }

    return latest;
};
