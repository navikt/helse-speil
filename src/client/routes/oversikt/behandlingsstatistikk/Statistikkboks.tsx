import React, { ReactNode, useState } from 'react';
import { Flex } from '../../../components/Flex';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import styled from '@emotion/styled';
import { Statistikklinje } from './Statistikklinje';

interface AccordionProps {
    erSynlig: boolean;
}

const Accordion = styled.div<AccordionProps>`
    ${({ erSynlig }) =>
        erSynlig
            ? `
    display: initial;
    `
            : `    
    display: none;`}
`;

interface StatistikkboksProps {
    tittel: string;
    upperBound: number;
    elementer: { etikett: ReactNode; antall: number }[];
    visesByDefault?: boolean;
}

export const Statistikkboks = ({ tittel, upperBound, elementer, visesByDefault = false }: StatistikkboksProps) => {
    const [erAktiv, setErAktiv] = useState(visesByDefault);

    const Container = styled.div`
        margin-bottom: 2rem;
    `;

    const Header = styled(Flex)`
        margin-bottom: 0.5rem;
    `;

    const Tittel = styled(Undertekst)`
        color: var(--navds-color-gray-80);
        margin-right: 0.5rem;
    `;

    const StyledElement = styled(Element)`
        flex-grow: 1;
        color: var(--navds-color-gray-80);
    `;

    return (
        <Container>
            <Header alignItems={'center'}>
                <Tittel>{tittel}</Tittel>
                <StyledElement>{upperBound}</StyledElement>
                <div onClick={() => setErAktiv(!erAktiv)}>{erAktiv ? <OppChevron /> : <NedChevron />}</div>
            </Header>
            <Accordion erSynlig={erAktiv}>
                {elementer.map((element, index) => (
                    <Statistikklinje
                        key={index}
                        etikett={element.etikett}
                        upperBound={upperBound}
                        currentValue={element.antall}
                    />
                ))}
            </Accordion>
        </Container>
    );
};
