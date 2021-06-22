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

export const BegrunnelseTextarea = () => {
    const [begrunnelse, setBegrunnelse] = useState('');
    const form = useFormContext();
    const name = 'begrunnelse';

    return (
        <Label>
            <Normaltekst id="begrunnelse-label">Begrunnelse</Normaltekst>
            <Textarea
                name={name}
                id={name}
                value={begrunnelse}
                textareaRef={form.register({ required: 'Begrunnelse må fylles ut', minLength: 1 })}
                onChange={(event) => setBegrunnelse(event.target.value)}
                placeholder="Begrunn hvorfor det er gjort endringer i inntekten som legges til grunn. Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn."
                maxLength={500}
                aria-labelledby="begrunnelse-label begrunnelse-feil"
            />
            {form.errors[name] && <Feilmelding id="begrunnelse-feil">{form.errors[name].message}</Feilmelding>}
        </Label>
    );
};
