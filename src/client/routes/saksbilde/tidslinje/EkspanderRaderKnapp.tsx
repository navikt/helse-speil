import React from 'react';

import NavFrontendChevron from 'nav-frontend-chevron';

import { Button } from '../../../components/Button';

interface EkspanderRaderKnappProps {
    erAktiv: boolean;
    onClick: () => void;
}

export const EkspanderRaderKnapp = ({ erAktiv, onClick }: EkspanderRaderKnappProps) => (
    <Button onClick={onClick}>
        <NavFrontendChevron type={erAktiv ? 'ned' : 'høyre'} />
    </Button>
);
