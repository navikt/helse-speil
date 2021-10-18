import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { TekstMedEllipsis } from '../../components/TekstMedEllipsis';
import { NORSK_DATOFORMAT } from '../../utils/date';

const Høyrestilt = styled(BodyShort)`
    text-align: right;
`;

const Stillingstittel = styled.div`
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
`;

interface ArbeidsforholdProps {
    stillingsprosent: number;
    stillingstittel: string;
    startdato: DateString;
    sluttdato?: DateString;
}

export const Arbeidsforhold = ({ stillingsprosent, stillingstittel, startdato, sluttdato }: ArbeidsforholdProps) => (
    <>
        <Stillingstittel>
            <TekstMedEllipsis>{stillingstittel}</TekstMedEllipsis>, {stillingsprosent} %
        </Stillingstittel>
        <Høyrestilt as="p">
            {dayjs(startdato).format(NORSK_DATOFORMAT)}
            {' - '}
            {sluttdato && dayjs(sluttdato).format(NORSK_DATOFORMAT)}
        </Høyrestilt>
    </>
);
