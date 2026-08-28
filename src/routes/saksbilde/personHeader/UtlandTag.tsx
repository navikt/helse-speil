import React, { ReactElement } from 'react';

import { finnPeriodeTilGodkjenning } from '@state/inntektsforhold/inntektsforhold';
import { useFetchPersonQuery } from '@state/person';

import { TagMedTooltip } from './TagMedTooltip';

export const UtlandTag = (): ReactElement | null => {
    const { data } = useFetchPersonQuery();
    const person = data?.person;
    if (!person) return null;

    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    if (!periodeTilGodkjenning) return null;

    const utlandVarsel = periodeTilGodkjenning.varsler.find((varsel) => varsel.kode === 'SB_EX_5');

    return utlandVarsel ? (
        <TagMedTooltip tooltipTekst={utlandVarsel.tittel} etikett="Utland" dataColor="brand-magenta" />
    ) : null;
};
