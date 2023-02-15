import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { FlexColumn } from '@components/Flex';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { kanOverstyreRefusjonsopplysninger } from '@utils/featureToggles';

const Input = styled.input<{ error?: boolean }>`
    height: 2rem;
    border-radius: 3px;
    border: 1px solid var(--navds-semantic-color-border);
    outline: none;

    &:focus-visible {
        box-shadow: var(--navds-shadow-focus);
    }

    ${({ error }) =>
        error &&
        css`
            border-width: 2px;
            border-color: var(--navds-semantic-color-feedback-danger-text);
        `}
`;

const Feilmelding = styled.label`
    margin: 0.25rem 0;
    color: var(--navds-semantic-color-feedback-danger-text);
`;

interface MånedsbeløpInputProps {
    initialMånedsbeløp?: number;
    skalDeaktiveres: boolean;
}

export const MånedsbeløpInput = ({ initialMånedsbeløp, skalDeaktiveres }: MånedsbeløpInputProps) => {
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
            måVæreEnEndring: (value) =>
                kanOverstyreRefusjonsopplysninger ||
                Number.parseFloat(value) !== initialMånedsbeløpRounded ||
                'Kan ikke være likt gammelt beløp',
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
                    defaultValue={initialMånedsbeløpRounded}
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
