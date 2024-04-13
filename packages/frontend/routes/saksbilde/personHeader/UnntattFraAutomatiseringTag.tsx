import React from 'react';

import { TagMedTooltip } from './TagMedTooltip';

interface UnntattFraAutomatiseringTagProps {
    unntatt?: Maybe<boolean>;
}

export const UnntattFraAutomatiseringTag: React.FC<UnntattFraAutomatiseringTagProps> = ({ unntatt }) => {
    return unntatt ? (
        <TagMedTooltip
            tooltipTekst="Bruker er unntatt fra automatisk godkjenning"
            etikett="Unntatt fra automatisk godkjenning"
        />
    ) : null;
};
