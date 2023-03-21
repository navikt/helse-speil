import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Textarea } from '@navikt/ds-react';

const StyledTextarea = styled(Textarea)`
    white-space: pre-line;
`;

export const ForklaringTextarea = () => {
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
            description={`Begrunn hvorfor det er gjort endringer i inntekt og/eller refusjon.\nEks. «Ny inntektsmelding kommet inn 18.10.2021»\nBlir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.`}
            maxLength={1000}
            aria-labelledby="forklaring-label forklaring-feil"
            {...textareaValidation}
        />
    );
};
