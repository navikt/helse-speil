import React, { ReactElement } from 'react';

import { Maybe, PersonFragment } from '@io/graphql';

import { TagMedTooltip } from './TagMedTooltip';

interface FullmaktTagProps {
    person: PersonFragment;
}

export const FullmaktTag = ({ person }: FullmaktTagProps): Maybe<ReactElement> => {
    const harFullmakt = person?.personinfo?.fullmakt;
    return harFullmakt ? <TagMedTooltip tooltipTekst="Den sykmeldte er under fullmakt" etikett="Fullmakt" /> : null;
};
