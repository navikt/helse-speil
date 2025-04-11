import React, { ReactElement } from 'react';

import { FigureCombinationIcon, FigureInwardIcon, FigureOutwardIcon } from '@navikt/aksel-icons';

import { Kjonn } from '@io/graphql';

interface GenderIconProps extends React.SVGAttributes<SVGElement> {
    gender: Kjonn;
}

const genderIcons = {
    Kvinne: FigureOutwardIcon,
    Mann: FigureInwardIcon,
    Ukjent: FigureCombinationIcon,
};

export const GenderIcon = ({ gender }: GenderIconProps): ReactElement => {
    const Icon = genderIcons[gender];
    return <Icon fontSize="1.5em" />;
};
