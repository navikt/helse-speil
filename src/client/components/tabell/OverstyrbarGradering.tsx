import React, { ChangeEvent } from 'react';
import { Sykdomsdag } from '../../context/types.internal';
import { useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';

const Container = styled.span`
    display: flex;
    white-space: nowrap;
    > .typo-element {
        margin-left: 1rem;
    }
`;

const Error = styled.label`
    vertical-align: center;
    color: #ba3a26;
    display: flex;
    align-items: center;
    font-weight: 600;
    margin-left: 0.5rem;
`;

const GraderingInput = styled.input<{ error: boolean }>`
    box-sizing: border-box;
    height: 26px;
    width: 4rem;
    padding: 3px 8px;
    border-radius: 3px;
    border: 1px solid #78706a;
    font-size: 14px;
    font-family: inherit;
    color: #3e3832;
    outline: none;

    &:hover {
        border-color: #254b6d;
        box-shadow: none;
    }

    &:focus {
        border-color: #254b6d;
        box-shadow: 0 0 0 2px #254b6d;
    }

    ${({ error }) =>
        error &&
        `
        border-color: #ba3a26;
        box-shadow: 0 0 0 1px #ba3a26;
    `}
`;

interface OverstyrbarDagtypeProps {
    dag: Sykdomsdag;
    onOverstyr: (dag: Sykdomsdag) => void;
    onFjernOverstyring: (dag: Sykdomsdag) => void;
}

export const OverstyrbarGradering = ({ dag, onOverstyr, onFjernOverstyring }: OverstyrbarDagtypeProps) => {
    const { register, errors, trigger } = useFormContext();

    const name = dag.dato.format('YYYY-MM-DD');
    const hasError = errors[name] !== undefined;

    const onChangeGradering = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const nyGradering = +target.value;
        if (nyGradering === dag.gradering) {
            onFjernOverstyring(dag);
        } else {
            onOverstyr({ ...dag, gradering: nyGradering });
        }
    };

    return (
        <Container>
            <GraderingInput
                name={name}
                id={name}
                type="number"
                ref={register({
                    min: { value: 0, message: 'Gradering må være 0 eller større' },
                    max: { value: 100, message: 'Gradering må være 100 eller mindre' },
                    required: 'Gradering mangler',
                })}
                defaultValue={dag.gradering}
                onChange={onChangeGradering}
                error={hasError}
                aria-invalid={hasError}
                onBlur={() => trigger(name)}
                aria-label={`Gradering for ${name}`}
            />
            {errors[name] && <Error htmlFor={name}>{errors[name].message}</Error>}
        </Container>
    );
};
