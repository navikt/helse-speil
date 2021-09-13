import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '../../utils/date';

const Høyrestilt = styled(BodyShort)`
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
            <BodyShort component="p">{`${stilling}, ${stillingsprosent} %`}</BodyShort>
            <Høyrestilt component="p">
                {startdato.format(NORSK_DATOFORMAT)}
                {' - '}
                {sluttdato && sluttdato.format(NORSK_DATOFORMAT)}
            </Høyrestilt>
        </>
    );
};
