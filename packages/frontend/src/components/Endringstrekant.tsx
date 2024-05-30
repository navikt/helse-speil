import React from 'react';

import { Infotrekant } from '@components/Infotrekant';

interface EndringstrekantProps {
    text?: string;
}

export const Endringstrekant: React.FC<EndringstrekantProps> = ({
    text = 'Endringene vil oppdateres og kalkuleres etter du har trykket på ferdig',
}) => <Infotrekant text={text} />;
