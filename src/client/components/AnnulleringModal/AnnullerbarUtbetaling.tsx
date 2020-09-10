import React from 'react';
import { Utbetaling } from '../../context/types.internal';
import styled from '@emotion/styled';
import { Normaltekst } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { Checkbox as NavCheckbox } from 'nav-frontend-skjema';
import { useFormContext } from 'react-hook-form';

const Tekst = styled(Normaltekst)`
    padding-left: 2.125rem;
    margin-bottom: 0.375rem;

    &:last-child {
        margin-bottom: 1.75rem;
    }
`;

const Checkbox = styled(NavCheckbox)`
    margin-bottom: 1.5rem;

    label.skjemaelement__label {
        font-size: 1rem;
        font-weight: 600;
        color: #3e3832;
        padding-left: 2.125rem;

        &:before {
            top: -1px;
        }
    }
`;

interface AnnullerbarUtbetalingProps {
    mottaker: 'arbeidsgiver' | 'person';
    utbetaling: Utbetaling;
}

export const AnnullerbarUtbetaling = ({ mottaker, utbetaling }: AnnullerbarUtbetalingProps) => {
    const { register, clearErrors } = useFormContext();

    if (utbetaling.linjer.length === 0) return null;

    return (
        <>
            <Checkbox
                name={mottaker}
                label={`Annullér utbetaling til ${mottaker}`}
                checkboxRef={register()}
                onChange={() => clearErrors('utbetalingIkkeValgt')}
            />
            <Tekst>Følgende utbetalinger annulleres:</Tekst>
            {utbetaling.linjer.map((linje, index) => (
                <Tekst key={index}>
                    {linje.fom.format(NORSK_DATOFORMAT)} - {linje.tom.format(NORSK_DATOFORMAT)} - {linje.dagsats} kr
                </Tekst>
            ))}
        </>
    );
};
