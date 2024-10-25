import React, { ReactElement } from 'react';

import { PersonPencilIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, HelpText } from '@navikt/ds-react';

import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Maybe } from '@io/graphql';
import { capitalizeArbeidsgiver } from '@utils/locale';

interface UtbetalingHeaderProps {
    periodeErForkastet: boolean;
    toggleOverstyring: () => void;
    arbeidsgiverNavn: string;
}

export const UtbetalingHeader = ({
    periodeErForkastet,
    toggleOverstyring,
    arbeidsgiverNavn,
}: UtbetalingHeaderProps): Maybe<ReactElement> => (
    <HStack align="center" gap="1">
        <Heading size="xsmall" level="1">
            Dagoversikt{' '}
            <AnonymizableContainer as="span">{capitalizeArbeidsgiver(arbeidsgiverNavn)}</AnonymizableContainer>
        </Heading>
        {periodeErForkastet ? (
            <HelpText>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</HelpText>
        ) : (
            <Button
                size="xsmall"
                variant="tertiary"
                onClick={toggleOverstyring}
                icon={<PersonPencilIcon fontSize="1.5rem" />}
            >
                Overstyr dager
            </Button>
        )}
    </HStack>
);
