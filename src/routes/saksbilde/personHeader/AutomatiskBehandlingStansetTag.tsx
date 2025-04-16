import React, { ReactElement } from 'react';

import { Maybe } from '@io/graphql';
import { TagMedTooltip } from '@saksbilde/personHeader/TagMedTooltip';

interface AutomatiskBehandlingStansetTagProps {
    erStanset: boolean;
}

export function AutomatiskBehandlingStansetTag({
    erStanset,
}: AutomatiskBehandlingStansetTagProps): Maybe<ReactElement> {
    if (!erStanset) return null;
    return (
        <TagMedTooltip
            tooltipTekst="Saksbehandler har stanset automatisk behandling for denne personen"
            etikett="Automatisk behandling stanset"
            variant="error"
        />
    );
}
