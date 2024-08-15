import React, { ReactElement } from 'react';

import { Maybe } from '@io/graphql';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';

import { TagMedTooltip } from './TagMedTooltip';

export const FullmaktTag = (): Maybe<ReactElement> => {
    const periodeTilGodkjenning = usePeriodeTilGodkjenning();
    if (!periodeTilGodkjenning) return null;

    const harFullmakt = periodeTilGodkjenning.varsler.find((varsel) => varsel.kode === 'SB_IK_1');

    return harFullmakt ? <TagMedTooltip tooltipTekst="Den sykmeldte er under fullmakt" etikett="Fullmakt" /> : null;
};
