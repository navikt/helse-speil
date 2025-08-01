import React, { ReactElement } from 'react';

import { PersonFragment } from '@io/graphql';

import { TagMedTooltip } from './TagMedTooltip';

interface FullmaktTagProps {
    person: PersonFragment;
}

export const FullmaktTag = ({ person }: FullmaktTagProps): ReactElement | null => {
    const harFullmakt = person?.personinfo?.fullmakt;
    return harFullmakt ? <TagMedTooltip tooltipTekst="Den sykmeldte er under fullmakt" etikett="Fullmakt" /> : null;
};
