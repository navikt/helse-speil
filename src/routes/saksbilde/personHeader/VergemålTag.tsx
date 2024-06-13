import React, { ReactElement } from 'react';

import { Maybe } from '@io/graphql';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';

import { TagMedTooltip } from './TagMedTooltip';

export const VergemålTag = (): Maybe<ReactElement> => {
    const periodeTilGodkjenning = usePeriodeTilGodkjenning();
    if (!periodeTilGodkjenning) return null;

    const harVergemål = periodeTilGodkjenning.varsler.find((varsel) => varsel.kode === 'SB_EX_4');

    return harVergemål ? <TagMedTooltip tooltipTekst="Den sykmeldte er under vergemål" etikett="Vergemål" /> : null;
};
