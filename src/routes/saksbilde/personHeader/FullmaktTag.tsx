import React, { ReactElement } from 'react';

import { Maybe } from '@io/graphql';
import { useFetchPersonQuery } from '@state/person';

import { TagMedTooltip } from './TagMedTooltip';

export const FullmaktTag = (): Maybe<ReactElement> => {
    const { data } = useFetchPersonQuery();
    const harFullmakt = data?.person?.personinfo?.fullmakt;
    return harFullmakt ? <TagMedTooltip tooltipTekst="Den sykmeldte er under fullmakt" etikett="Fullmakt" /> : null;
};
