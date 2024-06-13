import { ArbeidsgiverFragment, Maybe, PersonFragment } from '@io/graphql';
import { ActivePeriod } from '@typer/shared';

/**
 Finner arbeidsgiver HVIS perioden du sender inn er i nyeste generasjon.
 */
export const getArbeidsgiverWithPeriod = (
    person: PersonFragment,
    period: ActivePeriod,
): Maybe<ArbeidsgiverFragment> => {
    return person.arbeidsgivere.find((it) => it.generasjoner[0]?.perioder.find((it) => it.id === period.id)) ?? null;
};
