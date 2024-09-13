import React, { ReactElement } from 'react';

import { Maybe, PersonFragment } from '@io/graphql';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';

import { TagMedTooltip } from './TagMedTooltip';

interface UtlandTagProps {
    person: PersonFragment;
}

export const UtlandTag = ({ person }: UtlandTagProps): Maybe<ReactElement> => {
    const periodeTilGodkjenning = usePeriodeTilGodkjenning(person);
    if (!periodeTilGodkjenning) return null;

    const utlandVarsel = periodeTilGodkjenning.varsler.find((varsel) => varsel.kode === 'SB_EX_5');

    return utlandVarsel ? <TagMedTooltip tooltipTekst={utlandVarsel.tittel} etikett="Utland" /> : null;
};
