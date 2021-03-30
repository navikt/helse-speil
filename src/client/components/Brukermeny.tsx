import React, { useState } from 'react';
import { NedChevron } from 'nav-frontend-chevron';
import styled from '@emotion/styled';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import Lenke from 'nav-frontend-lenker';

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

const Brukerinfo = styled.div`
    border-bottom: 1px solid var(--navds-color-gray-40);
`;

const BrukerLenke = styled(Lenke)`
    margin-right: 10px;
`;

interface BrukermenyProps {
    ident: string;
    navn: string;
}

const Brukermeny: React.FC<BrukermenyProps> = ({ navn, ident }) => {
    const [anchor, setAnchor] = useState<HTMLElement | undefined>(undefined);
    return (
        <BrukermenyContainer>
            <p>{navn}</p>
            <Neddropp onClick={(e) => (anchor ? setAnchor(undefined) : setAnchor(e.currentTarget))}>
                <NedChevron />
            </Neddropp>
            <Popover
                ankerEl={anchor}
                onRequestClose={() => setAnchor(undefined)}
                orientering={PopoverOrientering.Under}
                tabIndex={-1}
            >
                <Brukerinfo>
                    <h5>ident</h5>
                </Brukerinfo>
                <BrukerLenke href={'/logout'}>Logg ut</BrukerLenke>
            </Popover>
        </BrukermenyContainer>
    );
};

export default Brukermeny;
