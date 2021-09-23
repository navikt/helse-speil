import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { Accordion, BodyShort } from '@navikt/ds-react';

import { Statistikklinje } from './Statistikklinje';

const Boks = styled(Accordion.Item)`
    margin-bottom: 1.75rem;

    > button {
        margin-bottom: 4px;
        border: none;

        &:hover {
            border: none;
        }
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
        <BodyShort as="p">{tittel}</BodyShort>
        <BodyShort as="p">{tilgjengeligeSaker}</BodyShort>
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
    <Boks defaultOpen={visesByDefault}>
        <Accordion.Header>
            <Heading tittel={tittel} tilgjengeligeSaker={tilgjengeligeSaker} />
        </Accordion.Header>
        <Accordion.Content>
            {elementer.map((element, index) => (
                <Statistikklinje
                    key={index}
                    etikett={element.etikett}
                    upperBound={tilgjengeligeSaker}
                    currentValue={element.antall}
                />
            ))}
        </Accordion.Content>
    </Boks>
);
