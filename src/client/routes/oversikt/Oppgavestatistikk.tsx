import React, { useState } from 'react';
import { Normaltekst, Undertekst, Element } from 'nav-frontend-typografi';
import styled from '@emotion/styled';
import { Progresjonsbar } from '@navikt/helse-frontend-progresjonsbar';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { Flex } from '../../components/Flex';
import { TekstMedEllipsis } from '../../components/TekstMedEllipsis';
import { saksbehandlingsstatistikkEnabled } from '../../featureToggles';

const Container = styled.div`
    border-left: 1px solid var(--navds-color-border);
    padding: 2rem;
`;

export interface AccordionProps {
    erSynlig: boolean;
}

export const Accordion = styled.div<AccordionProps>`
    ${({ erSynlig }) =>
        erSynlig
            ? `
    display: initial;
    `
            : `    
    display: none;`}
`;

const Header = styled(Normaltekst)`
    width: 100%;
    font-family: inherit;
    font-weight: 600;
    font-size: 1.25rem;
    padding-top: 1rem;
    height: 26px;
`;

const Separator = styled.div`
    width: 285px;
    height: 1px;
    margin: 1rem 0 2rem 0;
    background-color: var(--navds-color-border);
`;

const StyledProgresjonsbar = styled(Progresjonsbar)`
    height: 0.5rem;
    flex: 1;
`;

const StyledLabel = styled(TekstMedEllipsis)`
    width: 35px;
    margin-right: 20px;
    text-align: right;
`;

interface StatistikklinjeProps {
    label: string;
    upperBound: number;
    currentValue: number;
}

const Statistikklinje = ({ label, upperBound, currentValue }: StatistikklinjeProps) => {
    return (
        <Flex alignItems={'center'} style={{ marginBottom: '.5rem' }}>
            <StyledLabel>{label}</StyledLabel>
            <StyledProgresjonsbar upperBound={upperBound} currentValue={currentValue} />
        </Flex>
    );
};

interface StatistikkboksProps {
    tittel: string;
    upperBound: number;
    elementer: { label: string; value: number }[];
}

const Statistikkboks = ({ tittel, upperBound, elementer }: StatistikkboksProps) => {
    const [erAktiv, setErAktiv] = useState(false);
    return (
        <>
            <Flex alignItems={'center'} style={{ marginBottom: '.5rem' }}>
                <Undertekst style={{ color: '#78706A', marginRight: '.5rem' }}>{tittel}</Undertekst>
                <Element style={{ flexGrow: 1, color: '#78706A' }}>{upperBound}</Element>
                <div onClick={() => setErAktiv(!erAktiv)}>{erAktiv ? <OppChevron /> : <NedChevron />}</div>
            </Flex>
            <Accordion erSynlig={erAktiv}>
                {elementer.map((element) => (
                    <Statistikklinje label={element.label} upperBound={upperBound} currentValue={element.value} />
                ))}
            </Accordion>
        </>
    );
};

export const Oppgavestatistikk = () => {
    return saksbehandlingsstatistikkEnabled ? (
        <Container>
            <Header>Totalt behandlede saker i dag</Header>
            <Separator />
            <Statistikkboks
                tittel={'TILGJENGELIGE SAKER'}
                upperBound={1024}
                elementer={[
                    { label: '1024', value: 1024 },
                    { label: 'F', value: 100 },
                    { label: 'FL', value: 150 },
                    { label: 'FI', value: 64 },
                    { label: 'R', value: 600 },
                ]}
            />
        </Container>
    ) : (
        <></>
    );
};
