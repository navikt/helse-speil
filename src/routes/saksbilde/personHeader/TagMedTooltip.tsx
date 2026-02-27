import React, { ReactElement } from 'react';

import { Tag, TagProps, Tooltip } from '@navikt/ds-react';

type TagMedTooltipProps = {
    tooltipTekst: string;
    etikett: string;
    dataColor?: TagProps['data-color'];
};

export const TagMedTooltip = ({ tooltipTekst, etikett, dataColor = 'warning' }: TagMedTooltipProps): ReactElement => (
    <Tooltip
        content={tooltipTekst}
        maxChar={120} /* Når tooltip-teksten er over maxChar, vises det en warn i console om at teksten er vel lang. */
    >
        <Tag variant="outline" data-color={dataColor} size="small">
            {etikett}
        </Tag>
    </Tooltip>
);
