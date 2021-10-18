import styled from '@emotion/styled';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio, RadioGroup } from '@navikt/ds-react';

const BegrunnelseFieldset = styled(RadioGroup)`
    > .navds-radio {
        padding: 0;
    }

    margin-bottom: 2rem;
`;

export const Begrunnelser = () => {
    const form = useFormContext();
    const { ref, ...begrunnelseValidation } = form.register('begrunnelse', { required: 'Velg en begrunnelse' });
    return (
        <BegrunnelseFieldset
            legend="Begrunnelse"
            id="begrunnelse"
            name="begrunnelse"
            error={form.formState.errors['begrunnelse']?.message}
        >
            <Radio ref={ref} value="Korrigert inntekt i inntektsmelding" {...begrunnelseValidation}>
                Korrigert inntekt i inntektsmelding
            </Radio>
            <Radio ref={ref} value="Tariffendring i inntektsmelding" {...begrunnelseValidation}>
                Tariffendring i inntektsmelding
            </Radio>
            <Radio ref={ref} value="Innrapportert feil inntekt til A-ordningen" {...begrunnelseValidation}>
                Innrapportert feil inntekt til A-ordningen
            </Radio>
            <Radio ref={ref} value="Annen kilde til endring" {...begrunnelseValidation}>
                Annen kilde til endring
            </Radio>
        </BegrunnelseFieldset>
    );
};
