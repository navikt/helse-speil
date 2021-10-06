import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const Input = styled.input<{ error?: boolean }>`
    height: 2rem;
    border-radius: 3px;
    border: 1px solid var(--navds-color-border);
    outline: none;

    &:focus-visible {
        box-shadow: var(--navds-shadow-focus);
    }

    ${({ error }) =>
        error &&
        css`
            border-width: 2px;
            border-color: var(--navds-color-text-error);
        `}
`;

const Feilmelding = styled.label`
    margin: 0.25rem 0;
    color: var(--navds-color-text-error);
`;

interface MånedsbeløpInputProps {
    initialMånedsbeløp?: number;
}

export const MånedsbeløpInput = ({ initialMånedsbeløp }: MånedsbeløpInputProps) => {
    const form = useFormContext();

    const { ref, onBlur, ...inputValidation } = form.register('månedsbeløp', {
        required: 'Månedsbeløp mangler',
        min: { value: 0, message: 'Månedsbeløp må være 0 eller større' },
        validate: {
            måVæreNumerisk: (value) => !isNaN(Number.parseInt(value)) || 'Månedsbeløp må være et beløp',
            måVæreEnEndring: (value) =>
                Number.parseInt(value) !== initialMånedsbeløp || 'Kan ikke være likt gammelt beløp',
        },
    });

    return (
        <>
            <Input
                id="månedligInntekt"
                ref={ref}
                defaultValue={initialMånedsbeløp}
                error={form.formState.errors.månedsbeløp?.message}
                onBlur={(event) => {
                    onBlur(event);
                    form.trigger('månedligInntekt');
                }}
                {...inputValidation}
            />
            {form.formState.errors.månedsbeløp && (
                <Feilmelding htmlFor="månedligInntekt">{form.formState.errors.månedsbeløp.message}</Feilmelding>
            )}
        </>
    );
};
