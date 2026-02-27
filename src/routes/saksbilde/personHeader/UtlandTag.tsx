import React, { ReactElement } from 'react';

import { PersonFragment } from '@io/graphql';
import { finnPeriodeTilGodkjenning } from '@state/inntektsforhold/inntektsforhold';

import { TagMedTooltip } from './TagMedTooltip';

interface UtlandTagProps {
    person: PersonFragment;
}

export const UtlandTag = ({ person }: UtlandTagProps): ReactElement | null => {
    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    if (!periodeTilGodkjenning) return null;

    const utlandVarsel = periodeTilGodkjenning.varsler.find((varsel) => varsel.kode === 'SB_EX_5');

    return utlandVarsel ? (
        <TagMedTooltip tooltipTekst={utlandVarsel.tittel} etikett="Utland" dataColor="brand-magenta" />
    ) : null;
};
