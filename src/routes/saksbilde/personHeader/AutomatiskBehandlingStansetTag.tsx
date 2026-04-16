import React, { ReactElement } from 'react';

import { TagMedTooltip } from '@saksbilde/personHeader/TagMedTooltip';
import { somNorskDato } from '@utils/date';

interface AutomatiskBehandlingStansetTagProps {
    erStanset: boolean;
    dato: string;
}

export function AutomatiskBehandlingStansetTag({
    erStanset,
    dato,
}: AutomatiskBehandlingStansetTagProps): ReactElement | null {
    if (!erStanset) return null;
    return (
        <TagMedTooltip
            tooltipTekst="Saksbehandler har stanset automatisk behandling for denne personen"
            etikett={`Automatisk behandling stanset ${somNorskDato(dato)}`}
            dataColor="danger"
        />
    );
}
