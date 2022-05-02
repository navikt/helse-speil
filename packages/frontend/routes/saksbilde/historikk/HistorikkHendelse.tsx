import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { getFormattedDatetimeString } from '@utils/date';

import { Hendelse } from './Historikk.types';
import { Bold } from '@components/Bold';

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
`;

export const HistorikkHendelse = ({ icon, title, body, timestamp }: Hendelse) => {
    return (
        <Container>
            <IconContainer>{icon ?? <EmptyIcon />}</IconContainer>
            <ContentContainer>
                <Bold>{title}</Bold>
                {body}
                {timestamp && <BodyShort size="small">{getFormattedDatetimeString(timestamp)}</BodyShort>}
            </ContentContainer>
        </Container>
    );
};
