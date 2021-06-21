import styled from '@emotion/styled';
import React from 'react';

import { Element, Undertekst } from 'nav-frontend-typografi';

import { NORSK_DATOFORMAT } from '../../../utils/date';

import { Hendelse } from './Historikk.types';

const Container = styled.li`
    margin: 0;
    padding: 16px 0;
    display: flex;

    &:not(:last-of-type) {
        border-bottom: 1px solid var(--navds-color-border);
    }
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    margin-right: 16px;
    height: 22px;
    width: 20px;
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const EmptyIcon = styled.div`
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    border: 2px solid var(--navds-color-text-primary);
    border-radius: 10px;
`;

export const HistorikkHendelse = ({ icon, title, body, timestamp }: Hendelse) => {
    return (
        <Container>
            <IconContainer>{icon ?? <EmptyIcon />}</IconContainer>
            <ContentContainer>
                <Element>{title}</Element>
                {body}
                {timestamp && <Undertekst>{timestamp.format(NORSK_DATOFORMAT)}</Undertekst>}
            </ContentContainer>
        </Container>
    );
};
