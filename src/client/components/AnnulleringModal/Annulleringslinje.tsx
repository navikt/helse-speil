import { Utbetalingslinje } from '../../context/types.internal';
import styled from '@emotion/styled';
import { Checkbox } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT } from '../../utils/date';
import React, { Dispatch, SetStateAction } from 'react';

interface AnnulleringslinjeProps {
    label: string;
    linjer: Utbetalingslinje[];
    checked: boolean;
    setChecked: Dispatch<SetStateAction<boolean>>;
}

const Annulleringscheckbox = styled(Checkbox)`
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

const Tekst = styled(Normaltekst)`
    padding-left: 2.125rem;
    margin-bottom: 0.375rem;

    &:last-child {
        margin-bottom: 1.75rem;
    }
`;

export const Annulleringslinje = ({ label, linjer, checked, setChecked }: AnnulleringslinjeProps) => (
    <span>
        <Annulleringscheckbox label={label} checked={checked} onChange={(event) => setChecked(event.target.checked)} />
        <Tekst>Følgende utbetalinger annulleres:</Tekst>
        {linjer.map((linje, index) => (
            <Tekst key={index}>
                {linje.fom.format(NORSK_DATOFORMAT)} - {linje.tom.format(NORSK_DATOFORMAT)} - {linje.dagsats} kr
            </Tekst>
        ))}
    </span>
);
