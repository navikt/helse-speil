import React from 'react';

import { Tag, Tooltip } from '@navikt/ds-react';

import { Reservasjon } from '@io/graphql';

import styles from './PersonHeader.module.css';

interface ReservasjonTagProps {
    reservasjon?: Maybe<Reservasjon>;
}

type TagMedTooltipProps = {
    tooltipTekst: string;
    etikett: string;
};

const TagMedTooltip: React.FC<TagMedTooltipProps> = ({ tooltipTekst, etikett }) => (
    <Tooltip content={tooltipTekst} maxChar={120}>
        <Tag variant="warning" size="medium" className={styles.Tag}>
            {etikett}
        </Tag>
    </Tooltip>
);

export const ReservasjonTag: React.FC<ReservasjonTagProps> = ({ reservasjon }) => {
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
