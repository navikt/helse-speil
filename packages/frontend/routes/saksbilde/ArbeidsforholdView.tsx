import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { TextWithEllipsis } from '@components/TextWithEllipsis';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { NORSK_DATOFORMAT } from '@utils/date';
import { Maybe } from '@io/graphql';

const Høyrestilt = styled(AnonymizableText)`
    text-align: right;
`;

const Stillingstittel = styled(AnonymizableContainer)`
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
`;

interface ArbeidsforholdProps {
    stillingsprosent: number;
    stillingstittel: string;
    startdato: DateString;
    sluttdato?: Maybe<DateString>;
}

export const ArbeidsforholdView = ({
    stillingsprosent,
    stillingstittel,
    startdato,
    sluttdato,
}: ArbeidsforholdProps) => (
    <>
        <Stillingstittel as="div">
            <TextWithEllipsis>{stillingstittel}</TextWithEllipsis>, {stillingsprosent} %
        </Stillingstittel>
        <Høyrestilt>
            {dayjs(startdato).format(NORSK_DATOFORMAT)}
            {' - '}
            {sluttdato && dayjs(sluttdato).format(NORSK_DATOFORMAT)}
        </Høyrestilt>
    </>
);
