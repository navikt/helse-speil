import React, { ReactElement } from 'react';

import { TagMedTooltip } from './TagMedTooltip';

interface FullmaktTagProps {
    fullmakt?: boolean | null;
}

export const FullmaktTag = ({ fullmakt }: FullmaktTagProps): ReactElement | null =>
    fullmakt ? <TagMedTooltip tooltipTekst="Den sykmeldte er under fullmakt" etikett="Fullmakt" /> : null;
