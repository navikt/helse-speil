import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { Accordion, BodyShort } from '@navikt/ds-react';

import { Statistikklinje } from './Statistikklinje';

const Boks = styled(Accordion)`
    margin-bottom: 1.75rem;
    border: none;

    &:hover {
        border: none;
    }

    > button {
        margin-bottom: 4px;
    }

    > button,
    .navds-accordion__content {
        padding: 4px;
    }

    svg > path {
        fill: var(--navds-color-text-primary);
    }
`;

const HeadingContainer = styled.div`
    display: flex;
    align-items: center;
    margin-right: 1rem;

    > p:first-of-type {
        font-size: 14px;
        margin-right: 0.5rem;
        font-weight: 400;
    }

    > p {
        color: var(--navds-color-gray-80);
    }
`;

interface HeadingProps {
    tittel: string;
    tilgjengeligeSaker: number;
}

const Heading = ({ tittel, tilgjengeligeSaker }: HeadingProps) => (
    <HeadingContainer>
        <BodyShort component="p">{tittel}</BodyShort>
        <BodyShort component="p">{tilgjengeligeSaker}</BodyShort>
    </HeadingContainer>
);

interface StatistikkboksProps extends HeadingProps {
    elementer: { etikett: ReactNode; antall: number }[];
    visesByDefault?: boolean;
}

export const Statistikkboks = ({
    tittel,
    tilgjengeligeSaker,
    elementer,
    visesByDefault = false,
}: StatistikkboksProps) => (
    <Boks heading={<Heading tittel={tittel} tilgjengeligeSaker={tilgjengeligeSaker} />} open={visesByDefault}>
        {elementer.map((element, index) => (
            <Statistikklinje
                key={index}
                etikett={element.etikett}
                upperBound={tilgjengeligeSaker}
                currentValue={element.antall}
            />
        ))}
    </Boks>
);
