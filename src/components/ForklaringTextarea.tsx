import React, { ReactElement, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Textarea } from '@navikt/ds-react';

interface ForklaringTextareaProps {
    description: string;
}

export const ForklaringTextarea = ({ description }: ForklaringTextareaProps): ReactElement => {
    const form = useFormContext();

    const [forklaring, setForklaring] = useState('');

    const { ref, onChange, ...textareaValidation } = form.register('forklaring', {
        required: 'Forklaring må fylles ut',
        minLength: 1,
    });

    return (
        <Textarea
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
            style={{ whiteSpace: 'pre-line' }}
            size="small"
            {...textareaValidation}
        />
    );
};
