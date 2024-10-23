import React, { ReactElement } from 'react';

import { PersonPencilIcon } from '@navikt/aksel-icons';
import { Box, Button, HelpText } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';

interface UtbetalingHeaderProps {
    periodeErForkastet: boolean;
    toggleOverstyring: () => void;
}

export const UtbetalingHeader = ({
    periodeErForkastet,
    toggleOverstyring,
}: UtbetalingHeaderProps): Maybe<ReactElement> => (
    <Box>
        {periodeErForkastet ? (
            <HelpText>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</HelpText>
        ) : (
            <Button
                size="xsmall"
                variant="secondary"
                onClick={toggleOverstyring}
                icon={<PersonPencilIcon fontSize="1.5rem" />}
            >
                Overstyr dager
            </Button>
        )}
    </Box>
);
