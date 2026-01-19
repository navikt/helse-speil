import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { Skeleton, Tooltip } from '@navikt/ds-react';

import { useGetKrrRegistrertStatusForPerson } from '@io/rest/generated/krr/krr';
import { ApiKrrRegistrertStatus } from '@io/rest/generated/spesialist.schemas';

import { TagMedTooltip } from './TagMedTooltip';

export const ReservasjonTag = (): ReactElement | null => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: response, isLoading } = useGetKrrRegistrertStatusForPerson(personPseudoId);
    const registrertStatus = response?.data;

    if (isLoading) {
        return (
            <Tooltip content="Henter status fra Kontakt- og Reservasjonsregisteret...">
                <Skeleton variant="rectangle" width="6rem" />
            </Tooltip>
        );
    }

    if (!registrertStatus) {
        return (
            <TagMedTooltip
                tooltipTekst="Systemet har ikke klart å hente status fra Kontakt- og reservasjonsregisteret"
                etikett="Status KRR utilgjengelig"
            />
        );
    }

    switch (registrertStatus) {
        case ApiKrrRegistrertStatus.IKKE_REGISTRERT_I_KRR:
            return (
                <TagMedTooltip
                    tooltipTekst="Ikke registrert eller mangler samtykke i Kontakt- og reservasjonsregisteret, eventuell kommunikasjon må skje i brevform"
                    etikett="Ikke registrert KRR"
                />
            );
        case ApiKrrRegistrertStatus.RESERVERT_MOT_DIGITAL_KOMMUNIKASJON_ELLER_VARSLING:
            return (
                <TagMedTooltip
                    tooltipTekst="Bruker har reservert seg mot digital kommunikasjon i Kontakt- og reservasjonsregisteret, eventuell kommunikasjon må skje i brevform"
                    etikett="Reservert KRR"
                />
            );
        case ApiKrrRegistrertStatus.IKKE_RESERVERT_MOT_DIGITAL_KOMMUNIKASJON_ELLER_VARSLING:
            return null;
    }
};
