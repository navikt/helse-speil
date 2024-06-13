import React, { ReactElement } from 'react';

import { Maybe } from '@io/graphql';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';

import { TagMedTooltip } from './TagMedTooltip';

export const UtlandTag = (): Maybe<ReactElement> => {
    const periodeTilGodkjenning = usePeriodeTilGodkjenning();
    if (!periodeTilGodkjenning) return null;

    const utlandVarsel = periodeTilGodkjenning.varsler.find((varsel) => varsel.kode === 'SB_EX_5');

    return utlandVarsel ? <TagMedTooltip tooltipTekst={utlandVarsel.tittel} etikett="Utland" /> : null;
};
