import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { FlexColumn } from '@components/Flex';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';

const Input = styled.input<{ error?: boolean }>`
    height: 2rem;
    border-radius: 3px;
    border: 1px solid var(--a-border-strong);
    outline: none;

    &:focus-visible {
        box-shadow: var(--a-shadow-focus);
    }

    ${({ error }) =>
        error &&
        css`
            border-width: 2px;
            border-color: var(--a-text-danger);
        `}
`;

const Feilmelding = styled.label`
    margin: 0.25rem 0;
    color: var(--a-text-danger);
`;

interface MånedsbeløpInputProps {
    initialMånedsbeløp?: number;
    skalDeaktiveres: boolean;
    lokaltMånedsbeløp: Maybe<number>;
}

export const MånedsbeløpInput = ({
    initialMånedsbeløp,
    skalDeaktiveres,
    lokaltMånedsbeløp = null,
}: MånedsbeløpInputProps) => {
    const form = useFormContext();
    const initialMånedsbeløpRounded =
        initialMånedsbeløp && Math.round((initialMånedsbeløp + Number.EPSILON) * 100) / 100;

    const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);

    const { ref, onBlur, ...inputValidation } = form.register('manedsbelop', {
        disabled: skalDeaktiveres,
        required: 'Månedsbeløp mangler',
        min: { value: 0, message: 'Månedsbeløp må være 0 eller større' },
        validate: {
            måVæreNumerisk: (value) => isNumeric(value) || 'Månedsbeløp må være et beløp',
            måVæreMindreEnn: (value) => value < 10000000 || 'Systemet håndterer ikke månedsbeløp over 10 millioner',
        },
        setValueAs: (value) => value.replaceAll(' ', '').replaceAll(',', '.'),
    });

    return (
        <>
            <FlexColumn>
                <Input
                    id="manedsbelop"
                    ref={ref}
                    defaultValue={lokaltMånedsbeløp || initialMånedsbeløpRounded}
                    error={form.formState.errors.manedsbelop?.message}
                    onBlur={(event) => {
                        onBlur(event);
                        form.trigger('manedsbelop');
                    }}
                    {...inputValidation}
                />
                {form.formState.errors.manedsbelop && (
                    <Feilmelding htmlFor="manedsbelop">{form.formState.errors.manedsbelop.message}</Feilmelding>
                )}
            </FlexColumn>
            {skalDeaktiveres && (
                <FlexColumn style={{ marginTop: '4px' }}>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>
                            Det er ikke støtte for endring på månedsbeløp i saker som har vært delvis behandlet i
                            infotrygd
                        </p>
                    </PopoverHjelpetekst>
                </FlexColumn>
            )}
        </>
    );
};
