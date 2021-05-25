import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element, Undertekst } from 'nav-frontend-typografi';

import { Flex } from '../../../components/Flex';

import { Statistikklinje } from './Statistikklinje';

interface StatistikkboksProps {
    tittel: string;
    upperBound: number;
    elementer: { etikett: ReactNode; antall: number }[];
    visesByDefault?: boolean;
}

export const Statistikkboks = ({ tittel, upperBound, elementer, visesByDefault = false }: StatistikkboksProps) => {
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

    const Heading = () => {
        return (
            <Flex alignItems={'center'}>
                <Tittel>{tittel}</Tittel>
                <StyledElement>{upperBound}</StyledElement>
            </Flex>
        );
    };

    return (
        <StyledEkspanderbartPanel tittel={<Heading />} border={false} apen={visesByDefault}>
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
};
