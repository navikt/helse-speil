import { Arbeidsgiver } from '@io/graphql';

/**
 Finner arbeidsgiver HVIS perioden du sender inn er i nyeste generasjon.
 */
export const getArbeidsgiverWithPeriod = (person: FetchedPerson, period: ActivePeriod): Arbeidsgiver | null => {
    return person.arbeidsgivere.find((it) => it.generasjoner[0]?.perioder.find((it) => it === period)) ?? null;
};
