import React from 'react';

import { EditButton } from '@components/EditButton';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';

import styles from './UtbetalingHeader.module.css';

interface UtbetalingHeaderProps {
    periodeErForkastet: boolean;
    toggleOverstyring: () => void;
    overstyrer: boolean;
    revurderingIsEnabled?: boolean;
    overstyrRevurderingIsEnabled?: boolean;
}

export const UtbetalingHeader: React.FC<UtbetalingHeaderProps> = ({
    periodeErForkastet,
    toggleOverstyring,
    overstyrer,
    revurderingIsEnabled,
    overstyrRevurderingIsEnabled,
}) => {
    const editButton = (
        <EditButton
            isOpen={overstyrer}
            onOpen={toggleOverstyring}
            onClose={toggleOverstyring}
            openText="Avbryt"
            closedText={revurderingIsEnabled || overstyrRevurderingIsEnabled ? 'Revurder' : 'Endre'}
        />
    );
    return (
        <div className={styles.container}>
            {periodeErForkastet ? (
                <div className={styles.infoboble}>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</p>
                    </PopoverHjelpetekst>
                </div>
            ) : (
                editButton
            )}
        </div>
    );
};
