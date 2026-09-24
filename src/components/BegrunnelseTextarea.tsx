import React, { ReactElement, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Textarea } from '@navikt/ds-react';

import { VisesIkkeIVedtakTag } from '@components/tags/VisesIkkeIVedtakTag';

interface BegrunnelseTextareaProps {
    description: string;
}

export const BegrunnelseTextarea = ({ description }: BegrunnelseTextareaProps): ReactElement => {
    const form = useFormContext();

    const [begrunnelse, setBegrunnelse] = useState('');

    const { ref, onChange, ...textareaValidation } = form.register('begrunnelse', {
        required: 'Begrunnelse må fylles ut',
        minLength: 1,
    });

    return (
        <Textarea
            label={<VisesIkkeIVedtakTag label="Begrunnelse" />}
            id="begrunnelse"
            value={begrunnelse}
            ref={ref}
            onChange={(event) => {
                void onChange(event);
                setBegrunnelse(event.target.value);
            }}
            description={description}
            aria-labelledby="begrunnelse-label begrunnelse-feil"
            error={form.formState.errors.begrunnelse ? (form.formState.errors.begrunnelse.message as string) : null}
            style={{ whiteSpace: 'pre-line' }}
            size="small"
            {...textareaValidation}
        />
    );
};
