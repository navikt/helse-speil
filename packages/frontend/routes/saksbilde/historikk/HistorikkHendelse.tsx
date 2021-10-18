import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT_MED_KLOKKESLETT } from '../../../utils/date';

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
`;

const Bold = styled(BodyShort)`
    font-weight: 600;
`;

const Timestamp = styled(BodyShort)`
    font-size: 14px;
`;

export const HistorikkHendelse = ({ icon, title, body, timestamp }: Hendelse) => {
    return (
        <Container>
            <IconContainer>{icon ?? <EmptyIcon />}</IconContainer>
            <ContentContainer>
                <Bold as="p">{title}</Bold>
                {body}
                {timestamp && <Timestamp as="p">{timestamp.format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}</Timestamp>}
            </ContentContainer>
        </Container>
    );
};
