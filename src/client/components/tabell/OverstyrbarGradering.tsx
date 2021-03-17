import React, { ChangeEvent } from 'react';
import { Sykdomsdag } from 'internal-types';
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
    color: var(--navds-color-text-error);
    display: flex;
    align-items: center;
    font-weight: 600;
    margin-left: 0.5rem;
`;

const GraderingInput = styled.input<{ error: boolean }>`
    box-sizing: border-box;
    height: 26px;
    width: 2.5rem;
    padding: 3px 8px;
    border-radius: 3px;
    border: 1px solid var(--navds-color-border);
    font-size: 14px;
    font-family: inherit;
    color: var(--navds-color-text-primary);
    outline: none;
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    -moz-appearance: textfield;

    &:hover {
        border-color: var(--navds-text-focus);
        box-shadow: none;
    }

    &:focus {
        border-color: var(--navds-text-focus);
        box-shadow: 0 0 0 2px var(--navds-text-focus);
    }

    ${({ error }) =>
        error &&
        `
        border-color: var(--navds-color-text-error);
        box-shadow: 0 0 0 1px var(--navds-color-text-error);
    `}
`;

interface OverstyrbarDagtypeProps {
    dag: Sykdomsdag;
    onOverstyr: (dag: Sykdomsdag) => void;
}

export const OverstyrbarGradering = ({ dag, onOverstyr }: OverstyrbarDagtypeProps) => {
    const { register, errors, trigger } = useFormContext();

    const name = dag.dato.format('YYYY-MM-DD');
    const hasError = errors[name] !== undefined;

    const onChangeGradering = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const nyGradering = +target.value;
        onOverstyr({ ...dag, gradering: nyGradering });
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
