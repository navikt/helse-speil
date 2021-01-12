import React from 'react';
import { Periodetype } from 'internal-types';
import styled from '@emotion/styled';

interface ContainerProps {
    tittel?: Periodetype;
}

const Container = styled.div`
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 18px;
    padding: 4px 16px;
    height: 24px;
    min-width: 150px;

    color: ${({ tittel }: ContainerProps) => {
        switch (tittel) {
            case Periodetype.Førstegangsbehandling:
            case Periodetype.Infotrygdforlengelse:
            case Periodetype.OvergangFraInfotrygd:
                return '#FFFFFF';
            default:
                return '#3e3832';
        }
    }};

    background-color: ${({ tittel }: ContainerProps) => {
        switch (tittel) {
            case Periodetype.Forlengelse:
                return '#C2EAF7';
            case Periodetype.Førstegangsbehandling:
                return '#826BA1';
            case Periodetype.OvergangFraInfotrygd:
            case Periodetype.Infotrygdforlengelse:
                return '#59514B';
            case Periodetype.Stikkprøve:
            default:
                return '#C4C4C4';
        }
    }};
`;

interface PeriodetypeProps {
    periodetype?: Periodetype;
}

export const Periodelabel = ({ periodetype }: PeriodetypeProps) => {
    const displayTittel = (tittel?: Periodetype) => {
        switch (tittel) {
            case Periodetype.Forlengelse:
                return 'FORLENGELSE';
            case Periodetype.Førstegangsbehandling:
                return 'FØRSTEGANGS.';
            case Periodetype.OvergangFraInfotrygd:
            case Periodetype.Infotrygdforlengelse:
                return 'FORLENGELSE - IT';
            case Periodetype.Stikkprøve:
                return 'STIKKPRØVE';
            default:
                return undefined;
        }
    };
    return <Container tittel={periodetype}>{displayTittel(periodetype)}</Container>;
};
