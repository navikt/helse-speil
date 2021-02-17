import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { Dayjs } from 'dayjs';

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
}: ArbeidsforholdProps) => (
    <>
        <Normaltekst>{`${
            anonymiseringEnabled ? 'Agurkifisert stillingstittel' : stillingstittel
        }, ${stillingsprosent} %`}</Normaltekst>
        <Normaltekst>
            {startdato.format(NORSK_DATOFORMAT)}
            {' - '}
            {sluttdato && sluttdato.format(NORSK_DATOFORMAT)}
        </Normaltekst>
    </>
);
