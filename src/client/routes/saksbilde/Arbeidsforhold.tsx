import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { NORSK_DATOFORMAT } from '../../utils/date';

const Høyrestilt = styled(Normaltekst)`
    text-align: right;
`;

interface ArbeidsforholdProps {
    stillingsprosent: number;
    stillingstittel: string;
    startdato: Dayjs;
    sluttdato?: Dayjs;
    anonymiseringEnabled: boolean;
}

export const Arbeidsforhold = ({
    stillingsprosent,
    stillingstittel,
    startdato,
    sluttdato,
    anonymiseringEnabled,
}: ArbeidsforholdProps) => {
    const stilling = anonymiseringEnabled ? 'Agurkifisert stillingstittel' : stillingstittel;
    return (
        <>
            <Normaltekst>{`${stilling}, ${stillingsprosent} %`}</Normaltekst>
            <Høyrestilt>
                {startdato.format(NORSK_DATOFORMAT)}
                {' - '}
                {sluttdato && sluttdato.format(NORSK_DATOFORMAT)}
            </Høyrestilt>
        </>
    );
};
