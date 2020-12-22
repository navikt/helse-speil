import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { Dayjs } from 'dayjs';

interface ArbeidsforholdProps {
    stillingsprosent: number;
    stillingstittel: string;
    startdato: Dayjs;
    sluttdato?: Dayjs;
}

export const Arbeidsforhold = ({ stillingsprosent, stillingstittel, startdato, sluttdato }: ArbeidsforholdProps) => (
    <>
        <Normaltekst>{`${stillingstittel}, ${stillingsprosent} %`}</Normaltekst>
        <Normaltekst>
            {startdato.format(NORSK_DATOFORMAT)}
            {' - '}
            {sluttdato && sluttdato.format(NORSK_DATOFORMAT)}
        </Normaltekst>
    </>
);
