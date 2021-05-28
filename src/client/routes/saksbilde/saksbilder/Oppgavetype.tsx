import { Periodetype } from 'internal-types';
import React from 'react';

import { Flex } from '../../../components/Flex';
import { Oppgaveetikett } from '../../../components/Oppgaveetikett';

import { StyledUndertekstBold } from './Felles';

export const Oppgavetype = React.memo(({ periodetype }: { periodetype: Periodetype }) => {
    const label = () => {
        switch (periodetype) {
            case Periodetype.Forlengelse:
            case Periodetype.Infotrygdforlengelse:
                return 'FORLENGELSE';
            case Periodetype.Førstegangsbehandling:
                return 'FØRSTEGANGSBEHANDLING';
            case Periodetype.OvergangFraInfotrygd:
                return 'FORLENGELSE IT';
            case Periodetype.Stikkprøve:
                return 'STIKKPRØVE';
            case Periodetype.RiskQa:
                return 'RISK QA';
            case Periodetype.Revurdering:
                return 'REVURDERING';
        }
    };

    return (
        <Flex alignItems="center">
            <Oppgaveetikett type={periodetype} />
            <StyledUndertekstBold style={{ marginLeft: '12px' }}>{label()}</StyledUndertekstBold>
        </Flex>
    );
});
