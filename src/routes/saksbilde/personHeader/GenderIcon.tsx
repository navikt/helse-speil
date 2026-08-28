import React, { ReactElement } from 'react';

import { FigureCombinationIcon, FigureInwardIcon, FigureOutwardIcon } from '@navikt/aksel-icons';

import { ApiPersonKjønn } from '@io/rest/generated/spesialist.schemas';

interface GenderIconProps extends React.SVGAttributes<SVGElement> {
    gender: ApiPersonKjønn;
}

const genderIcons = {
    [ApiPersonKjønn.KVINNE]: FigureOutwardIcon,
    [ApiPersonKjønn.MANN]: FigureInwardIcon,
    [ApiPersonKjønn.UKJENT]: FigureCombinationIcon,
};

export const GenderIcon = ({ gender }: GenderIconProps): ReactElement => {
    const Icon = genderIcons[gender];
    return <Icon fontSize="1.5em" />;
};
