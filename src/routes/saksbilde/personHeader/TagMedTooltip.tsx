import React, { ReactElement } from 'react';

import { Tag, TagProps, Tooltip } from '@navikt/ds-react';

import styles from './PersonHeader.module.css';

type TagMedTooltipProps = {
    tooltipTekst: string;
    etikett: string;
    variant?: TagProps['variant'];
};

export const TagMedTooltip = ({ tooltipTekst, etikett, variant = 'warning' }: TagMedTooltipProps): ReactElement => (
    <Tooltip
        content={tooltipTekst}
        maxChar={120} /* Når tooltip-teksten er over maxChar, vises det en warn i console om at teksten er vel lang. */
    >
        <Tag variant={variant} size="medium" className={styles.Tag}>
            {etikett}
        </Tag>
    </Tooltip>
);
