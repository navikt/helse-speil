import React from 'react';
import { LasterTidslinje } from '../../../components/tidslinje';
import { LasterPersonlinje } from '../../../components/Personlinje';
import '@navikt/helse-frontend-logg/lib/main.css';
import { SaksbildeContainer } from '../Saksbilde';

export const LasterSaksbilde = () => (
    <SaksbildeContainer className="saksbilde" data-testid="laster-saksbilde">
        <LasterPersonlinje />
        <LasterTidslinje />
    </SaksbildeContainer>
);
