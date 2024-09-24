import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { CheckmarkIcon } from '@navikt/aksel-icons';

import { EditButton } from '@components/EditButton';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';

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
}: UtbetalingHeaderProps): ReactElement => {
    return (
        <div className={styles.container}>
            {periodeErForkastet ? (
                <div className={styles.infoboble}>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</p>
                    </PopoverHjelpetekst>
                </div>
            ) : (
                <>
                    {!overstyrer && kanOverstyreMinimumSykdomsgrad && (
                        <EditButton
                            isOpen={overstyrerMinimumSykdomsgrad}
                            onOpen={() => setOverstyrerMinimumSykdomsgrad(true)}
                            onClose={() => setOverstyrerMinimumSykdomsgrad(false)}
                            openText="Avbryt"
                            closedText="Vurder arbeidstid"
                            className={classNames({ [styles.button]: !overstyrerMinimumSykdomsgrad })}
                            closedIcon={<CheckmarkIcon fontSize="1.5rem" />}
                        />
                    )}
                    {!overstyrerMinimumSykdomsgrad && (
                        <EditButton
                            isOpen={overstyrer}
                            onOpen={toggleOverstyring}
                            onClose={toggleOverstyring}
                            openText="Avbryt"
                            closedText="Overstyr dager"
                            className={classNames({ [styles.button]: !overstyrer })}
                        />
                    )}
                </>
            )}
        </div>
    );
};
