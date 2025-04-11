import React, { ReactElement } from 'react';

import { FigureCombinationIcon, FigureInwardIcon, FigureOutwardIcon } from '@navikt/aksel-icons';

import { Kjonn, Maybe } from '@io/graphql';

interface GenderIconProps extends React.SVGAttributes<SVGElement> {
    gender?: Maybe<Kjonn>;
}

const genderComponents = {
    Kvinne: FigureOutwardIcon,
    Mann: FigureInwardIcon,
    Ukjent: FigureCombinationIcon,
};

export const GenderIcon = ({ gender }: GenderIconProps): ReactElement => {
    const Component = genderComponents[gender ?? 'Ukjent'];
    return <Component fontSize="1.5em" />;
};
