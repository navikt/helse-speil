import styled from '@emotion/styled';
import React from 'react';

import { Information } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { LovdataLenke } from '@components/LovdataLenke';

import { Paragraf, Tittel } from '../vilkårstitler';

const Container = styled.div`
    display: grid;
    align-items: center;
    grid-row-gap: 0.5rem;
    grid-template-columns: 2.5rem auto;
    grid-template-areas:
        'icon title'
        'none text';
    margin-bottom: 4rem;
`;

const IconContainer = styled(Flex)`
    justify-content: center;
    grid-area: icon;
`;

const TitleContainer = styled(Flex)`
    grid-area: title;
`;

const TextContainer = styled.div`
    grid-area: text;

    > p {
        margin-bottom: 0.125rem;
    }
`;

export const Yrkeskadeinfo: React.FC<React.HTMLAttributes<HTMLDivElement> & ChildrenProps> = (props) => (
    <Container data-testid="yrkesskade" {...props}>
        <IconContainer>
            <Information width={20} height={20} />
        </IconContainer>
        <TitleContainer>
            <Tittel as="h3">Systemet henter ikke inn yrkesskade</Tittel>
            <Paragraf as="p">
                <LovdataLenke paragraf="8-55">§ 8-55</LovdataLenke>
            </Paragraf>
        </TitleContainer>
        <TextContainer>
            <BodyShort as="p">Systemet henter per i dag ikke inn informasjon om yrkesskade.</BodyShort>
            <BodyShort as="p">Yrkesskade kan ha påvirkning på utfallet av enkelte vilkår.</BodyShort>
            <BodyShort as="p">Vurdering av yrkesskade følger ordinære rutiner.</BodyShort>
        </TextContainer>
    </Container>
);
