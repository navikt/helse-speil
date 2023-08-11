import React from 'react';

import { Tag, Tooltip } from '@navikt/ds-react';

import { Reservasjon } from '@io/graphql';

import styles from './PersonHeader.module.css';

interface ReservasjonTagProps {
    reservasjon?: Maybe<Reservasjon>;
}

export const ReservasjonTag: React.FC<ReservasjonTagProps> = ({ reservasjon }) => {
    if (!reservasjon) {
        return (
            <Tooltip
                content="Ikke registrert eller mangler samtykke i Kontakt- og reservasjonsregisteret, eventuell kommunikasjon må skje i brevform"
                maxChar={120}
            >
                <Tag variant="warning" size="medium" className={styles.Tag}>
                    Ikke registrert KRR
                </Tag>
            </Tooltip>
        );
    }

    if (reservasjon.reservert || !reservasjon.kanVarsles) {
        return (
            <Tooltip
                content="Bruker har reservert seg mot digital kommunikasjon i Kontakt- og reservasjonsregisteret, eventuell kommunikasjon må skje i brevform"
                maxChar={132}
            >
                <Tag variant="warning" size="medium" className={styles.Tag}>
                    Reservert KRR
                </Tag>
            </Tooltip>
        );
    }

    return null;
};
