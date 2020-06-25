import React, { ReactNode } from 'react';
import { useRecoilState } from 'recoil';
import styled from '@emotion/styled';
import { HeaderView } from '../Oversikt.styles';
import { Undertekst } from 'nav-frontend-typografi';
import { sorteringsretningState, aktivKolonneState, SorterbarKolonne } from '../oversiktState';

const Sorteringsknapp = styled.button`
    padding: 0 1rem 0 0;
    background: none;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:focus,
    &:active {
        p {
            color: #0067c5;
            text-decoration: underline;
        }
    }
`;

const Sorteringspiler = styled.div<{ direction: string }>`
    pointer-events: none;
    position: relative;
    height: 0.75rem;
    margin-left: 0.5rem;

    &:before,
    &:after {
        pointer-events: none;
        content: '';
        border-left: 0.25rem solid white;
        border-right: 0.25rem solid white;
        position: absolute;
        transition: all 0.1s ease;
    }

    &:before {
        border-bottom: 0.25rem solid #b7b1a9;
        transition: all 0.1s ease;
    }

    &:after {
        border-top: 0.25rem solid #3e3832;
        bottom: 0;
        transition: all 0.1s ease;
    }

    ${(props) =>
        (props.direction === 'ascending' &&
            `
            &:after { transform: translateY(-0.5rem) rotate(180deg); }
            &:before { transform: translateY(0.5rem) rotate(180deg); }
        `) ||
        (props.direction === 'inactive' &&
            `
            &:after { border-top: 0.25rem solid #b7b1a9; }
            &:before { border-bottom: 0.25rem solid #b7b1a9; }
        `)}
`;

interface SorterbarHeaderProps {
    tittel: string;
    kolonne: SorterbarKolonne;
    widthInPixels?: number;
}

export const SorterbarHeader = ({ tittel, kolonne, widthInPixels }: SorterbarHeaderProps) => {
    const [aktivKolonne, setAktivKolonne] = useRecoilState(aktivKolonneState);
    const [sortDirection, setSortDirection] = useRecoilState(sorteringsretningState);
    const byttRetning = () => {
        setSortDirection((prev) => (prev === 'ascending' ? 'descending' : 'ascending'));
    };
    const byttKolonne = () => setAktivKolonne(kolonne);
    const gjeldendeSortertKolonne = aktivKolonne === kolonne;

    return (
        <HeaderView widthInPixels={widthInPixels}>
            <Sorteringsknapp onClick={() => (!gjeldendeSortertKolonne ? byttKolonne() : byttRetning())}>
                <Undertekst>{tittel}</Undertekst>
                <Sorteringspiler direction={gjeldendeSortertKolonne ? sortDirection : 'inactive'} />
            </Sorteringsknapp>
        </HeaderView>
    );
};
