import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { Skeleton, Tooltip } from '@navikt/ds-react';

import { useGetKrrStatusForPerson } from '@io/rest/generated/krr/krr';

import { TagMedTooltip } from './TagMedTooltip';

export const ReservasjonTag = (): ReactElement | null => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: response, isPending } = useGetKrrStatusForPerson(personPseudoId);
    const reservasjon = response?.data;

    if (isPending) {
        return (
            <Tooltip content="Henter status fra Kontakt- og Reservasjonsregisteret...">
                <Skeleton variant="rectangle" width="6rem" />
            </Tooltip>
        );
    }

    if (reservasjon === undefined) {
        return (
            <TagMedTooltip
                tooltipTekst="Systemet har ikke klart å hente status fra Kontakt- og reservasjonsregisteret"
                etikett="Status KRR utilgjengelig"
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
