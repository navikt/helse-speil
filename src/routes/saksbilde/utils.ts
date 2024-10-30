import { PersonFragment } from '@io/graphql';
import { isTilkommenInntekt } from '@utils/typeguards';

export const harOverlappendeTilkommenInntekt = (person: PersonFragment, fom: string) =>
    person.arbeidsgivere.flatMap((ag) =>
        ag.nyeInntektsforholdPerioder.filter((it) => isTilkommenInntekt(it) && it.fom === fom),
    ).length > 0;
