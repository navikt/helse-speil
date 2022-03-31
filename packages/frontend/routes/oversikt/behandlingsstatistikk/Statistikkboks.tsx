import styled from '@emotion/styled';
import React, { Fragment, ReactNode } from 'react';

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

const StyledInnerBoks = styled(Accordion.Item)`
    > button {
        margin-bottom: 4px;
        border: none;
        padding: 0px;

        &:hover {
            border: none;
        }

        > div > p {
            font-weight: 400;
            font-size: 1rem;
        }
    }

    progress {
        width: 8em;
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
    antallSaker: number;
}

const Heading = ({ tittel, antallSaker }: HeadingProps) => (
    <HeadingContainer>
        <BodyShort as="p">{tittel}</BodyShort>
        <BodyShort as="p">{antallSaker}</BodyShort>
    </HeadingContainer>
);

interface InnerStatestikklinjeElementerProps {
    etikett: ReactNode;
    antall: number;
}

interface StatestikklinjeElementerProps {
    etikett: ReactNode;
    antall: number;
    elementer?: InnerStatestikklinjeElementerProps[];
}

interface InnerBoksProps {
    element: StatestikklinjeElementerProps;
    antallSaker: number;
}

const InnerBoks = ({ element, antallSaker }: InnerBoksProps) => (
    <StyledInnerBoks>
        <Accordion.Header>
            <Statistikklinje etikett={element.etikett} upperBound={antallSaker} currentValue={element.antall} />
        </Accordion.Header>
        <Accordion.Content>
            {element.elementer?.map((perElementType, index) => (
                <Statistikklinje
                    key={index}
                    etikett={perElementType.etikett}
                    upperBound={element.antall}
                    currentValue={perElementType.antall}
                />
            ))}
        </Accordion.Content>
    </StyledInnerBoks>
);

interface StatistikkboksProps extends HeadingProps {
    elementer: StatestikklinjeElementerProps[];
    visesByDefault?: boolean;
}

export const Statistikkboks = ({ tittel, antallSaker, elementer, visesByDefault = false }: StatistikkboksProps) => (
    <Boks defaultOpen={visesByDefault}>
        <Accordion.Header>
            <Heading tittel={tittel} antallSaker={antallSaker} />
        </Accordion.Header>
        <Accordion.Content>
            {elementer.map((element, index) => (
                <Fragment key={index}>
                    {element.elementer ? (
                        <InnerBoks element={element} antallSaker={antallSaker} />
                    ) : (
                        <Statistikklinje
                            etikett={element.etikett}
                            upperBound={antallSaker}
                            currentValue={element.antall}
                        />
                    )}
                </Fragment>
            ))}
        </Accordion.Content>
    </Boks>
);
