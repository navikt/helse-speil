import React from 'react';
import { Button } from '@navikt/ds-react';
import { EllipsisH } from '@navikt/ds-icons';

import styles from './KebabButton.module.css';

interface KebabButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {}

export const KebabButton = React.forwardRef<HTMLButtonElement, KebabButtonProps>(({ ...buttonProps }, ref) => {
    return (
        <Button ref={ref} className={styles.KebabButton} {...buttonProps}>
            <EllipsisH height={16} width={16} />
        </Button>
    );
});
