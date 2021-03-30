import React, { useState } from 'react';
import { NedChevron } from 'nav-frontend-chevron';
import styled from '@emotion/styled';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import Lenke from 'nav-frontend-lenker';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';

const BrukermenyContainer = styled.div`
    margin-left: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
`;

const Neddropp = styled.div`
    height: 48px;
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Strek = styled.hr`
    border: none;
    height: 1px;
    background-color: var(--navds-color-gray-40);
`;

const MenyNavn = styled(Normaltekst)`
    color: var(--navds-color-text-secondary);
    min-width: 180px;
`;

const BrukerLenke = styled(Lenke)`
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const BrukerNavn = styled(Element)`
    color: var(--navds-color-text-primary);
`;

const Underelement = styled(Undertekst)`
    color: var(--navds-color-text-primary);
    margin-bottom: 8px;
    margin-top: 8px;
`;

const PopoverElementContainer = styled.div`
    width: 180px;
    margin: 16px 8px;
`;

interface BrukermenyProps {
    ident: string;
    navn: string;
}

const Brukermeny: React.FC<BrukermenyProps> = ({ navn, ident }) => {
    const [anchor, setAnchor] = useState<HTMLElement | undefined>(undefined);
    return (
        <BrukermenyContainer>
            <MenyNavn>{navn}</MenyNavn>
            <Neddropp onClick={(e) => (anchor ? setAnchor(undefined) : setAnchor(e.currentTarget))}>
                <NedChevron />
            </Neddropp>
            <Popover
                ankerEl={anchor}
                onRequestClose={() => setAnchor(undefined)}
                orientering={PopoverOrientering.Under}
                tabIndex={-1}
            >
                <PopoverElementContainer>
                    <BrukerNavn>{navn}</BrukerNavn>
                    <Underelement>{ident}</Underelement>
                </PopoverElementContainer>
                <Strek />
                <PopoverElementContainer>
                    <BrukerLenke href={'/logout'}>Logg ut</BrukerLenke>
                </PopoverElementContainer>
            </Popover>
        </BrukermenyContainer>
    );
};

export default Brukermeny;
