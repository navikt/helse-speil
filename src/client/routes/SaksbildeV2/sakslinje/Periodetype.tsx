import React from 'react';
import { Periodetype as PeriodetypeTittel } from 'internal-types';
import styled from '@emotion/styled';

const mapPeriodetypeTittel = (tittel: PeriodetypeTittel) => {
    switch (tittel) {
        case PeriodetypeTittel.Forlengelse:
            return 'FORLENGELSE';
        case PeriodetypeTittel.Førstegangsbehandling:
            return 'FØRSTEGANGS.';
        case PeriodetypeTittel.Infotrygdforlengelse:
            return 'FORLENGELSE - IT';
    }
};

const mapPeriodetypeFarger = (tittel: PeriodetypeTittel) => {
    switch (tittel) {
        case PeriodetypeTittel.Forlengelse:
            return {
                backgroundColor: '#C2EAF7',
            };
        case PeriodetypeTittel.Førstegangsbehandling:
            return {
                backgroundColor: '#826BA1',
                color: '#FFFFFF',
            };
        case PeriodetypeTittel.Infotrygdforlengelse:
            return {
                backgroundColor: '#59514B',
                color: '#FFFFFF',
            };
    }
};

interface PeriodetypeProps {
    tittel: PeriodetypeTittel;
}

const Container = styled.div((props: PeriodetypeProps) => ({
    border: '1px solid transparent',
    borderRadius: '18px',
    padding: '4px 16px',
    ...mapPeriodetypeFarger(props.tittel),
}));

export const Periodetype = ({ tittel }: PeriodetypeProps) => (
    <Container tittel={tittel}> {mapPeriodetypeTittel(tittel)} </Container>
);
