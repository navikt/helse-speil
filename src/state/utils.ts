import dayjs, { Dayjs } from 'dayjs';

import { Arbeidsgiverinntekt, Maybe, PersonFragment, Vilkarsgrunnlag } from '@io/graphql';
import { getRequiredTimestamp, isGodkjent } from '@state/selectors/utbetaling';
import { DateString } from '@typer/shared';
import { isBeregnetPeriode } from '@utils/typeguards';

export const getRequiredInntekt = (
    vilkårsgrunnlag: Vilkarsgrunnlag,
    organisasjonsnummer: string,
): Arbeidsgiverinntekt =>
    vilkårsgrunnlag.inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer) ??
    (() => {
        throw Error('Fant ikke inntekt');
    })();

export const getVilkårsgrunnlag = (person: PersonFragment, grunnlagId?: Maybe<string>): Maybe<Vilkarsgrunnlag> => {
    return person.vilkarsgrunnlag.find(({ id }) => id === grunnlagId) ?? null;
};

export const getRequiredVilkårsgrunnlag = (person: PersonFragment, grunnlagId?: Maybe<string>): Vilkarsgrunnlag => {
    return (
        getVilkårsgrunnlag(person, grunnlagId) ??
        (() => {
            throw Error('Fant ikke vilkårsgrunnlag');
        })()
    );
};

export const getLatestUtbetalingTimestamp = (person: PersonFragment, after: DateString = '1970-01-01'): Dayjs => {
    let latest: Dayjs = dayjs(after);

    for (const arbeidsgiver of person.arbeidsgivere) {
        for (const periode of arbeidsgiver.generasjoner[0]?.perioder ?? []) {
            if (isBeregnetPeriode(periode) && isGodkjent(periode.utbetaling)) {
                latest = dayjs.max(dayjs(getRequiredTimestamp(periode.utbetaling)), latest) as Dayjs;
            }
        }
    }

    return latest;
};
