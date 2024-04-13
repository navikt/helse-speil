import React from 'react';

import { Tag, Tooltip } from '@navikt/ds-react';

import styles from './PersonHeader.module.css';

type TagMedTooltipProps = {
    tooltipTekst: string;
    etikett: string;
};

export const TagMedTooltip: React.FC<TagMedTooltipProps> = ({ tooltipTekst, etikett }) => (
    <Tooltip
        content={tooltipTekst}
        maxChar={120} /* Når tooltip-teksten er over maxChar, vises det en warn i console om at teksten er vel lang. */
    >
        <Tag variant="warning" size="medium" className={styles.Tag}>
            {etikett}
        </Tag>
    </Tooltip>
);
