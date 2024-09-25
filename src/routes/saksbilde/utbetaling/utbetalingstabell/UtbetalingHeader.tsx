import React, { ReactElement } from 'react';

import { CheckmarkIcon, PadlockLockedIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';

import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { Maybe } from '@io/graphql';

import styles from './UtbetalingHeader.module.css';

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
                <div className={styles.infoboble}>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</p>
                    </PopoverHjelpetekst>
                </div>
            ) : (
                <>
                    {kanOverstyreMinimumSykdomsgrad && (
                        <Button
                            size="xsmall"
                            variant="secondary"
                            onClick={() => setOverstyrerMinimumSykdomsgrad(true)}
                            icon={<CheckmarkIcon fontSize="1.5rem" />}
                        >
                            Vurder arbeidstid
                        </Button>
                    )}
                    <Button
                        size="xsmall"
                        variant="secondary"
                        onClick={toggleOverstyring}
                        icon={<PadlockLockedIcon fontSize="1.5rem" />}
                    >
                        Overstyr dager
                    </Button>
                </>
            )}
        </HStack>
    );
};
