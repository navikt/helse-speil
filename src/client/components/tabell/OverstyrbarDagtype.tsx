import React, { ChangeEvent, useState } from 'react';
import styled from '@emotion/styled';
import { Select } from '../Select';
import { Dagtype, Sykdomsdag } from 'internal-types';

const OverstyrbarSelect = styled(Select)`
    font-size: 14px;
    padding: 3px 12px 3px 8px;
`;

interface OverstyrbarDagtypeProps {
    dag: Sykdomsdag;
    onOverstyr: (dag: Sykdomsdag) => void;
}

const valgbareDager = [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding];

export const OverstyrbarDagtype = ({ dag, onOverstyr }: OverstyrbarDagtypeProps) => {
    const [opprinneligDagtype] = useState(dag.type);
    const onSelectDagtype = ({ target }: ChangeEvent<HTMLSelectElement>) => {
        const nyDagtype = target.value as Dagtype;
        onOverstyr({ ...dag, type: nyDagtype });
    };

    return (
        <OverstyrbarSelect defaultValue={dag.type} onChange={onSelectDagtype}>
            {Object.values(Dagtype)
                .filter((dagtype: Dagtype) => valgbareDager.includes(dagtype) || dagtype === opprinneligDagtype)
                .map((dagtype: Dagtype) => (
                    <option key={dagtype}>{dagtype}</option>
                ))}
        </OverstyrbarSelect>
    );
};
