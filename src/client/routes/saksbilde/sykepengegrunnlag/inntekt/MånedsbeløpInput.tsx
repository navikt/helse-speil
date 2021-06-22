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
    const name = 'månedsbeløp';

    return (
        <>
            <Input
                name={name}
                id={name}
                type="number"
                ref={form.register({
                    required: 'Månedsbeløp mangler',
                    min: { value: 0, message: 'Månedsbeløp må være 0 eller større' },
                })}
                defaultValue={initialMånedsbeløp}
                error={form.errors[name]}
                onBlur={() => form.trigger(name)}
            />
            {form.errors[name] && <Feilmelding htmlFor={name}>{form.errors[name].message}</Feilmelding>}
        </>
    );
};
