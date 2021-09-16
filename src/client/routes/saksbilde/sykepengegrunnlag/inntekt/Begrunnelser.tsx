import styled from '@emotion/styled';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Fieldset, Radio } from '@navikt/ds-react';

import { ErrorMessage } from '../../../../components/ErrorMessage';

const BegrunnelseFieldset = styled(Fieldset)`
    > .navds-radio {
        padding: 0;
    }

    margin-bottom: 2rem;
`;

export const Begrunnelser = () => {
    const form = useFormContext();
    const { ref, ...begrunnelseValidation } = form.register('begrunnelse', { required: 'Velg en begrunnelse' });
    return (
        <BegrunnelseFieldset legend="Begrunnelse" id="begrunnelse" error={form.formState.errors['begrunnelse']}>
            <Radio ref={ref} value="Korrigert inntektsmelding" {...begrunnelseValidation}>
                Korrigert inntektsmelding
            </Radio>
            <Radio ref={ref} value="Tariffendring" {...begrunnelseValidation}>
                Tariffendring
            </Radio>
            <Radio
                ref={ref}
                value="Arbeidsgiver har oppgitt feil inntekt i inntektsmeldingen"
                {...begrunnelseValidation}
            >
                Arbeidsgiver har oppgitt feil inntekt i inntektsmeldingen
            </Radio>
            <Radio ref={ref} value="Arbeidsgiver har innrapportert feil til A-ordningen" {...begrunnelseValidation}>
                Arbeidsgiver har innrapportert feil til A-ordningen
            </Radio>
            {form.formState.errors['begrunnelse'] && (
                <ErrorMessage>{form.formState.errors['begrunnelse'].message}</ErrorMessage>
            )}
        </BegrunnelseFieldset>
    );
};
