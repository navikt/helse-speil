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
    const [forklaring, setForklaring] = useState('');
    const form = useFormContext();
    const name = 'forklaring';

    return (
        <Label>
            <Normaltekst id="forklaring-label">Forklaring</Normaltekst>
            <Textarea
                name={name}
                id={name}
                value={forklaring}
                textareaRef={form.register({ required: 'Forklaring må fylles ut', minLength: 1 })}
                onChange={(event) => setForklaring(event.target.value)}
                placeholder="Begrunn hvorfor det er gjort endringer i inntekten som legges til grunn. Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn."
                maxLength={500}
                aria-labelledby="forklaring-label forklaring-feil"
            />
            {form.errors[name] && <Feilmelding id="forklaring-feil">{form.errors[name].message}</Feilmelding>}
        </Label>
    );
};
