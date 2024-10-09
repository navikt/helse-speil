import React, { ReactElement } from 'react';

import { BriefcaseClockIcon, PersonPencilIcon } from '@navikt/aksel-icons';
import { Button, HStack, HelpText } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';

interface UtbetalingHeaderProps {
    periodeErForkastet: boolean;
    toggleOverstyring: () => void;
    overstyrer: boolean;
    kanOverstyreMinimumSykdomsgrad: boolean;
    overstyrerMinimumSykdomsgrad: boolean;
    setOverstyrerMinimumSykdomsgrad: (overstyrer: boolean) => void;
}

export const UtbetalingHeader = ({
    periodeErForkastet,
    toggleOverstyring,
    overstyrer,
    kanOverstyreMinimumSykdomsgrad,
    overstyrerMinimumSykdomsgrad,
    setOverstyrerMinimumSykdomsgrad,
}: UtbetalingHeaderProps): Maybe<ReactElement> => {
    if (overstyrer || overstyrerMinimumSykdomsgrad) return null;
    return (
        <HStack gap="2">
            {periodeErForkastet ? (
                <HelpText>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</HelpText>
            ) : (
                <>
                    {kanOverstyreMinimumSykdomsgrad && (
                        <Button
                            size="xsmall"
                            variant="secondary"
                            onClick={() => setOverstyrerMinimumSykdomsgrad(true)}
                            icon={<BriefcaseClockIcon fontSize="1.5rem" />}
                        >
                            Vurder arbeidstid
                        </Button>
                    )}
                    <Button
                        size="xsmall"
                        variant="secondary"
                        onClick={toggleOverstyring}
                        icon={<PersonPencilIcon fontSize="1.5rem" />}
                    >
                        Overstyr dager
                    </Button>
                </>
            )}
        </HStack>
    );
};
