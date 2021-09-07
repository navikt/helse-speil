import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Textarea } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

const Label = styled.label`
    > p:first-of-type {
        margin-bottom: 1rem;
    }

    > .skjemaelement,
    textarea {
        min-height: 120px;
    }
`;

const Feilmelding = styled(Normaltekst)`
    margin: 0.25rem 0;
    color: var(--navds-color-text-error);
`;

export const ForklaringTextarea = () => {
    const form = useFormContext();

    const [forklaring, setForklaring] = useState('');

    const { ref, onChange, ...textareaValidation } = form.register('forklaring', {
        required: 'Forklaring må fylles ut',
        minLength: 1,
    });

    return (
        <Label>
            <Normaltekst id="forklaring-label">Forklaring</Normaltekst>
            <Textarea
                id={'forklaring'}
                value={forklaring}
                textareaRef={ref}
                onChange={(event) => {
                    onChange(event);
                    setForklaring(event.target.value);
                }}
                placeholder="Begrunn hvorfor det er gjort endringer i inntekten som legges til grunn. Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn."
                maxLength={500}
                aria-labelledby="forklaring-label forklaring-feil"
                {...textareaValidation}
            />
            {form.formState.errors.forklaring && (
                <Feilmelding id="forklaring-feil">{form.formState.errors.forklaring.message}</Feilmelding>
            )}
        </Label>
    );
};
