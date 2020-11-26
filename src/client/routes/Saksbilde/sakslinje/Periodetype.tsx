import React, { useContext } from 'react';
import { Periodetype as PeriodetypeTittel } from 'internal-types';
import styled from '@emotion/styled';
import { PersonContext } from '../../../context/PersonContext';

const mapPeriodetypeTittel = (tittel?: PeriodetypeTittel) => {
    switch (tittel) {
        case PeriodetypeTittel.Forlengelse:
            return 'FORLENGELSE';
        case PeriodetypeTittel.Førstegangsbehandling:
            return 'FØRSTEGANGS.';
        case PeriodetypeTittel.Infotrygdforlengelse:
            return 'FORLENGELSE - IT';
        default:
            return undefined;
    }
};

const mapPeriodetypeFarger = (tittel?: PeriodetypeTittel) => {
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
        default:
            return {
                backgroundColor: '#C4C4C4',
                width: '150px',
            };
    }
};

interface PeriodetypeProps {
    tittel?: PeriodetypeTittel;
}

const Container = styled.div((props: PeriodetypeProps) => ({
    boxSizing: 'border-box',
    border: '1px solid transparent',
    borderRadius: '18px',
    padding: '4px 16px',
    height: '24px',
    ...mapPeriodetypeFarger(props.tittel),
}));

export const Periodetype = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    return (
        <Container tittel={aktivVedtaksperiode?.periodetype}>
            {mapPeriodetypeTittel(aktivVedtaksperiode?.periodetype)}{' '}
        </Container>
    );
};
