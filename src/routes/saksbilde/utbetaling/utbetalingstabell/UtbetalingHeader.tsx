import React, { ReactElement } from 'react';

import { PersonPencilIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, HelpText } from '@navikt/ds-react';

import { Arbeidsgivernavn } from '@components/Inntektsforholdnavn';

import styles from './UtbetalingHeader.module.css';

interface UtbetalingHeaderProps {
    periodeErForkastet: boolean;
    toggleOverstyring: () => void;
    arbeidsgiverIdentifikator: string;
    arbeidsgiverNavn: string;
    erRevurdering: boolean;
}

export const UtbetalingHeader = ({
    periodeErForkastet,
    toggleOverstyring,
    arbeidsgiverIdentifikator,
    arbeidsgiverNavn,
    erRevurdering,
}: UtbetalingHeaderProps): ReactElement | null => (
    <HStack align="center" gap="1">
        <Heading size="xsmall" level="1">
            Dagoversikt
        </Heading>
        <Arbeidsgivernavn
            identifikator={arbeidsgiverIdentifikator}
            navn={arbeidsgiverNavn}
            weight="semibold"
            className={styles.mediumFontSize}
        />
        {periodeErForkastet ? (
            <HelpText>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</HelpText>
        ) : (
            <Button
                size="xsmall"
                variant="tertiary"
                onClick={toggleOverstyring}
                icon={<PersonPencilIcon fontSize="1.5rem" />}
            >
                {erRevurdering ? 'Revurder' : 'Endre'} dager
            </Button>
        )}
    </HStack>
);
