import { ActivePeriod } from '@/types/shared';
import { ArbeidsgiverFragment, PersonFragment } from '@io/graphql';

/**
 Finner arbeidsgiver HVIS perioden du sender inn er i nyeste generasjon.
 */
export const getArbeidsgiverWithPeriod = (
    person: PersonFragment,
    period: ActivePeriod,
): ArbeidsgiverFragment | null => {
    return person.arbeidsgivere.find((it) => it.generasjoner[0]?.perioder.find((it) => it.id === period.id)) ?? null;
};
