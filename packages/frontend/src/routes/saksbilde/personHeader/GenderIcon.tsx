import React from 'react';

import { KjønnsnøytraltIkon } from '@components/ikoner/KjønnsnøytraltIkon';
import { Kvinneikon } from '@components/ikoner/Kvinneikon';
import { Manneikon } from '@components/ikoner/Manneikon';
import { Kjonn, Maybe } from '@io/graphql';

interface GenderIconProps extends React.SVGAttributes<SVGElement> {
    gender?: Maybe<Kjonn>;
}

export const GenderIcon: React.FC<GenderIconProps> = ({ gender, ...svgProps }) => {
    switch (gender?.toLowerCase()) {
        case 'kvinne':
            return <Kvinneikon alt="Kvinne" {...svgProps} />;
        case 'mann':
            return <Manneikon alt="Mann" {...svgProps} />;
        default:
            return <KjønnsnøytraltIkon alt="Ukjent" {...svgProps} />;
    }
};
