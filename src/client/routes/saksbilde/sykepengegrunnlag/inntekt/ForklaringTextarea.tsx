import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Textarea } from '@navikt/ds-react';

const Label = styled.label`
    > p:first-of-type {
        margin-bottom: 1rem;
    }

    > .skjemaelement,
    textarea {
        min-height: 120px;
    }
`;

export const ForklaringTextarea = () => {
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
            placeholder="Begrunn hvorfor det er gjort endringer i inntekten som legges til grunn. Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn."
            maxLength={500}
            aria-labelledby="forklaring-label forklaring-feil"
            error={form.formState.errors.forklaring?.message}
            {...textareaValidation}
        />
    );
};
