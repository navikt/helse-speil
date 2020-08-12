import React, { ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { Select } from '../Select';
import { Dagtype, Sykdomsdag } from '../../context/types.internal';

const OverstyrbarSelect = styled(Select)`
    font-size: 14px;
    padding: 3px 12px 3px 8px;
`;

interface OverstyrbarDagtypeProps {
    dag: Sykdomsdag;
    onOverstyr: (dag: Sykdomsdag) => void;
    onFjernOverstyring: (dag: Sykdomsdag) => void;
}

const valgbareDager = [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding];

export const OverstyrbarDagtype = ({ dag, onOverstyr, onFjernOverstyring }: OverstyrbarDagtypeProps) => {
    const onSelectDagtype = ({ target }: ChangeEvent<HTMLSelectElement>) => {
        const nyDagtype = target.value as Dagtype;
        if (nyDagtype === dag.type) {
            onFjernOverstyring(dag);
        } else {
            onOverstyr({ ...dag, type: nyDagtype });
        }
    };

    return (
        <OverstyrbarSelect defaultValue={dag.type} onChange={onSelectDagtype}>
            {Object.values(Dagtype).map((dagtype) => (
                <option key={dagtype} disabled={!valgbareDager.includes(dagtype) && dagtype !== dag.type}>
                    {dagtype}
                </option>
            ))}
        </OverstyrbarSelect>
    );
};
