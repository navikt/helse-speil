import React, { ReactElement } from 'react';

import { PersonFragment } from '@io/graphql';
import { finnPeriodeTilGodkjenning } from '@state/inntektsforhold/inntektsforhold';

import { TagMedTooltip } from './TagMedTooltip';

interface VergemålTagProps {
    person: PersonFragment;
}

export const VergemålTag = ({ person }: VergemålTagProps): ReactElement | null => {
    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    if (!periodeTilGodkjenning) return null;

    const harVergemål = periodeTilGodkjenning.varsler.find((varsel) => varsel.kode === 'SB_EX_4');

    return harVergemål ? (
        <TagMedTooltip tooltipTekst="Den sykmeldte er under vergemål" etikett="Vergemål" dataColor="brand-magenta" />
    ) : null;
};
