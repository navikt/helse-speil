import React, { ReactElement } from 'react';

import { Maybe, Reservasjon } from '@io/graphql';

import { TagMedTooltip } from './TagMedTooltip';

interface ReservasjonTagProps {
    reservasjon?: Maybe<Reservasjon>;
}

export const ReservasjonTag = ({ reservasjon }: ReservasjonTagProps): ReactElement | null => {
    if (reservasjon === null) {
        return (
            <TagMedTooltip
                tooltipTekst="Systemet har ikke klart å hente status fra Kontakt- og reservasjonsregisteret"
                etikett="Status KRR utilgjengelig"
            />
        );
    }

    if (!reservasjon) {
        return (
            <TagMedTooltip
                tooltipTekst="Ikke registrert eller mangler samtykke i Kontakt- og reservasjonsregisteret, eventuell kommunikasjon må skje i brevform"
                etikett="Ikke registrert KRR"
            />
        );
    }

    if (reservasjon.reservert || !reservasjon.kanVarsles) {
        return (
            <TagMedTooltip
                tooltipTekst="Bruker har reservert seg mot digital kommunikasjon i Kontakt- og reservasjonsregisteret, eventuell kommunikasjon må skje i brevform"
                etikett="Reservert KRR"
            />
        );
    }

    return null;
};
