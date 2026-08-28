import React, { ReactElement } from 'react';

import { finnPeriodeTilGodkjenning } from '@state/inntektsforhold/inntektsforhold';
import { useFetchPersonQuery } from '@state/person';

import { TagMedTooltip } from './TagMedTooltip';

export const VergemålTag = (): ReactElement | null => {
    const { data } = useFetchPersonQuery();
    const person = data?.person;
    if (!person) return null;

    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    if (!periodeTilGodkjenning) return null;

    const harVergemål = periodeTilGodkjenning.varsler.find((varsel) => varsel.kode === 'SB_EX_4');

    return harVergemål ? (
        <TagMedTooltip tooltipTekst="Den sykmeldte er under vergemål" etikett="Vergemål" dataColor="brand-magenta" />
    ) : null;
};
