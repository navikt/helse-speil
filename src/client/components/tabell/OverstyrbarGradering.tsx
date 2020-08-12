import React, { ChangeEvent, useState } from 'react';
import { Sykdomsdag } from '../../context/types.internal';
import styled from '@emotion/styled';
import Input from 'nav-frontend-skjema/lib/input';

const GraderingInput = styled(Input)`
    > input {
        height: 1.5rem;
        width: max-content;
        font-size: 14px;
    }
`;

interface OverstyrbarDagtypeProps {
    dag: Sykdomsdag;
    onOverstyr: (dag: Sykdomsdag) => void;
    onFjernOverstyring: (dag: Sykdomsdag) => void;
}

const constrain = (value: number, min: number, max: number) => (value > max ? max : value < min ? min : value);

export const OverstyrbarGradering = ({ dag, onOverstyr, onFjernOverstyring }: OverstyrbarDagtypeProps) => {
    const [gradering, setGradering] = useState<string | number | undefined>(dag.gradering);

    const onChangeGradering = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.value.length === 0) {
            setGradering('');
            return;
        }
        const nyGradering = constrain(+target.value, 0, 100);
        if (nyGradering === dag.gradering) {
            onFjernOverstyring(dag);
        } else {
            onOverstyr({ ...dag, gradering: nyGradering });
        }
        setGradering(nyGradering);
    };

    return (
        <GraderingInput
            type="number"
            value={gradering}
            onChange={onChangeGradering}
            min="0"
            max="100"
            onBlur={() => gradering === undefined || ((gradering as string).length === 0 && setGradering(0))}
        />
    );
};
