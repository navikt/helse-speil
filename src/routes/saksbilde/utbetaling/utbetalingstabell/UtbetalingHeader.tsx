import React, { ReactElement } from 'react';

import { PersonPencilIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, HelpText } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';

import styles from './UtbetalingHeader.module.css';

interface UtbetalingHeaderProps {
    periodeErForkastet: boolean;
    toggleOverstyring: () => void;
    inntektsforholdReferanse: InntektsforholdReferanse;
    erRevurdering: boolean;
}

export const UtbetalingHeader = ({
    periodeErForkastet,
    toggleOverstyring,
    inntektsforholdReferanse,
    erRevurdering,
}: UtbetalingHeaderProps): ReactElement | null => (
    <HStack align="center" gap="space-4">
        <Heading size="xsmall" level="1">
            Dagoversikt
        </Heading>
        <Inntektsforholdnavn
            inntektsforholdReferanse={inntektsforholdReferanse}
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
