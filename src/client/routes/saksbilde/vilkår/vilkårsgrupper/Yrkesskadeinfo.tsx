import styled from '@emotion/styled';
import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Flex } from '../../../../components/Flex';
import { LovdataLenke } from '../../../../components/LovdataLenke';
import { IkonProps } from '../../../../components/ikoner/Ikon';

import { Paragraf, Tittel } from '../vilkårstitler';

const Infoikon = ({ alt }: IkonProps) => (
    <svg
        aria-labelledby="title"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title id="title">{alt}</title>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667ZM7.5 15.8333V14.1667H9.16667V10H7.5V8.33333H10.8333V14.1667H12.5V15.8333H7.5ZM10 4.16667C10.6904 4.16667 11.25 4.72631 11.25 5.41667C11.25 6.10702 10.6904 6.66667 10 6.66667C9.30964 6.66667 8.75 6.10702 8.75 5.41667C8.75 4.72631 9.30964 4.16667 10 4.16667Z"
            fill="#262626"
        />
    </svg>
);

const Container = styled.div`
    display: grid;
    align-items: center;
    grid-row-gap: 0.5rem;
    grid-template-columns: 2.5rem auto;
    grid-template-areas:
        'icon title'
        'none text';
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
`;

export const Yrkeskadeinfo: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
    <Container data-testid="yrkesskade" {...props}>
        <IconContainer>
            <Infoikon alt={'Til informasjon'} />
        </IconContainer>
        <TitleContainer>
            <Tittel>Systemet henter ikke inn yrkesskade</Tittel>
            <Paragraf>
                <LovdataLenke paragraf="8-55">§ 8-55</LovdataLenke>
            </Paragraf>
        </TitleContainer>
        <TextContainer>
            <Normaltekst>Systemet henter per i dag ikke inn informasjon om yrkesskade.</Normaltekst>
            <Normaltekst>Yrkesskade kan ha påvirkning på utfallet av enkelte vilkår.</Normaltekst>
            <Normaltekst>Vurdering av yrkesskade følger ordinære rutiner.</Normaltekst>
        </TextContainer>
    </Container>
);
