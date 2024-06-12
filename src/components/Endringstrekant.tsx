import React, { ReactElement } from 'react';

import { Infotrekant } from '@components/Infotrekant';

interface EndringstrekantProps {
    text?: string;
}

export const Endringstrekant = ({
    text = 'Endringene vil oppdateres og kalkuleres etter du har trykket på ferdig',
}: EndringstrekantProps): ReactElement => <Infotrekant text={text} />;
