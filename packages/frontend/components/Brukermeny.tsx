import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Collapse, Expand } from '@navikt/ds-icons';
import { BodyShort, Popover } from '@navikt/ds-react';

import { TekstMedEllipsis } from './TekstMedEllipsis';
import { DropdownMenyknapp } from './dropdown/Dropdown';

const Container = styled.div`
    margin-left: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;

    .navds-popover {
        padding: 16px 0;
        border-radius: 4px;
        z-index: 1001;

        &:focus,
        &:focus-visible {
            box-shadow: 0 0.05rem 0.25rem 0.125rem rgb(0 0 0 / 8%);
            border-color: var(--navds-text-focus);
        }
    }
`;

const DropdownButton = styled.button`
    height: 50px;
    width: 50px;
    margin: 0 16px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;

    > svg > path {
        fill: #fff;
    }

    &:focus-visible {
        box-shadow: inset var(--navds-shadow-focus-on-dark);
    }
`;

const MenyNavn = styled(TekstMedEllipsis)`
    color: var(--navds-color-text-secondary);
    width: 190px;
`;

const MenyTekst = styled(BodyShort)`
    color: var(--navds-color-text-primary);
    padding: 4px 16px;
`;

const MenyLenke = styled(DropdownMenyknapp)`
    display: flex;
    align-items: center;
    color: var(--navds-color-text-link);
    text-decoration: none;
    width: 100%;

    &:hover,
    &:focus {
        color: var(--navds-color-text-primary);
    }
`.withComponent('a');

const Strek = styled.hr`
    border: none;
    height: 1px;
    background-color: var(--navds-color-gray-40);
`;

interface BrukermenyProps {
    ident: string;
    navn: string;
}

export const Brukermeny: React.FC<BrukermenyProps> = ({ navn, ident }) => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const toggleAnchor = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        anchor ? setAnchor(null) : setAnchor(event.currentTarget);
    };

    return (
        <Container>
            <MenyNavn>{navn}</MenyNavn>
            <DropdownButton onClick={toggleAnchor}>{anchor ? <Collapse /> : <Expand />}</DropdownButton>
            <Popover
                open={anchor !== null}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
                placement="bottom-end"
                arrow={false}
                offset={-8}
            >
                <MenyTekst as="p">{navn}</MenyTekst>
                <MenyTekst as="p">{ident}</MenyTekst>
                <Strek />
                <MenyLenke href="/logout">Logg ut</MenyLenke>
            </Popover>
        </Container>
    );
};
