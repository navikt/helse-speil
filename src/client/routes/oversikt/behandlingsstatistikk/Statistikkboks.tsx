import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element, Undertekst } from 'nav-frontend-typografi';

import { Flex } from '../../../components/Flex';

import { Statistikklinje } from './Statistikklinje';

const StyledEkspanderbartPanel = styled(Ekspanderbartpanel)`
    margin-bottom: 1.75rem;
    box-shadow: none !important;

    :hover > button:focus {
        box-shadow: 0 0 0 3px var(--navds-color-blue-80) !important;
    }

    button {
        padding: 0.25rem;

        :focus {
            border-radius: 4px;
        }
    }
`;

const Tittel = styled(Undertekst)`
    color: var(--navds-color-gray-80);
    margin-right: 0.5rem;
`;

const StyledElement = styled(Element)`
    flex-grow: 1;
    color: var(--navds-color-gray-80);
`;

interface HeadingProps {
    tittel: string;
    upperBound: number;
}

const Heading = ({ tittel, upperBound }: HeadingProps) => (
    <Flex alignItems={'center'}>
        <Tittel>{tittel}</Tittel>
        <StyledElement>{upperBound}</StyledElement>
    </Flex>
);

interface StatistikkboksProps extends HeadingProps {
    elementer: { etikett: ReactNode; antall: number }[];
    visesByDefault?: boolean;
}

export const Statistikkboks = ({ tittel, upperBound, elementer, visesByDefault = false }: StatistikkboksProps) => (
    <StyledEkspanderbartPanel
        tittel={<Heading tittel={tittel} upperBound={upperBound} />}
        border={false}
        apen={visesByDefault}
    >
        {elementer.map((element, index) => (
            <Statistikklinje
                key={index}
                etikett={element.etikett}
                upperBound={upperBound}
                currentValue={element.antall}
            />
        ))}
    </StyledEkspanderbartPanel>
);
