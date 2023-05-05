import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Textarea } from '@navikt/ds-react';

const StyledTextarea = styled(Textarea)`
    white-space: pre-line;
`;
interface ForklaringTextareaProps {
    description: string;
}
export const ForklaringTextarea = ({ description }: ForklaringTextareaProps) => {
    const form = useFormContext();

    const [forklaring, setForklaring] = useState('');

    const { ref, onChange, ...textareaValidation } = form.register('forklaring', {
        required: 'Forklaring må fylles ut',
        minLength: 1,
    });

    return (
        <StyledTextarea
            label="Forklaring"
            id="forklaring"
            value={forklaring}
            ref={ref}
            onChange={(event) => {
                onChange(event);
                setForklaring(event.target.value);
            }}
            description={description}
            maxLength={1000}
            aria-labelledby="forklaring-label forklaring-feil"
            error={form.formState.errors.forklaring ? (form.formState.errors.forklaring.message as string) : null}
            {...textareaValidation}
        />
    );
};
