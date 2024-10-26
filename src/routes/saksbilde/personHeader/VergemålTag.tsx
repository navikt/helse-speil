import React, { ReactElement } from 'react';

import { Maybe, Person } from '@io/graphql';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';

import { TagMedTooltip } from './TagMedTooltip';

interface VergemålTagProps {
    person: Person;
}

export const VergemålTag = ({ person }: VergemålTagProps): Maybe<ReactElement> => {
    const periodeTilGodkjenning = usePeriodeTilGodkjenning(person);
    if (!periodeTilGodkjenning) return null;

    const harVergemål = periodeTilGodkjenning.varsler.find((varsel) => varsel.kode === 'SB_EX_4');

    return harVergemål ? <TagMedTooltip tooltipTekst="Den sykmeldte er under vergemål" etikett="Vergemål" /> : null;
};
