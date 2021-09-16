import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio } from 'nav-frontend-skjema';

import { ErrorMessage } from '../../../../components/ErrorMessage';

const Fieldset = styled.fieldset<{ error?: boolean }>`
    padding: 0;
    margin: 0 0 2rem;

    > legend {
        margin-bottom: 1rem;
    }

    > .skjemaelement:not(:last-of-type) {
        margin-bottom: 1rem;
    }

    > .skjemaelement:last-of-type {
        margin-bottom: 0.5rem;
    }

    > .skjemaelement > label.skjemaelement__label:before {
        box-sizing: border-box;
    }

    ${(props) =>
        props.error &&
        css`
            > .skjemaelement > label.skjemaelement__label:before {
                border-color: var(--navds-color-text-error);
                border-width: 2px;
            }
        `}
`;

export const Begrunnelser = () => {
    const form = useFormContext();
    const { ref, ...begrunnelseValidation } = form.register('begrunnelse', { required: 'Velg en begrunnelse' });
    return (
        <Fieldset id="begrunnelse" error={form.formState.errors['begrunnelse']}>
            <legend>Begrunnelse</legend>
            <Radio
                radioRef={ref}
                label="Korrigert inntektsmelding"
                value="Korrigert inntektsmelding"
                {...begrunnelseValidation}
            />
            <Radio radioRef={ref} label="Tariffendring" value="Tariffendring" {...begrunnelseValidation} />
            <Radio
                radioRef={ref}
                label="Arbeidsgiver har oppgitt feil inntekt i inntektsmeldingen"
                value="Arbeidsgiver har oppgitt feil inntekt i inntektsmeldingen"
                {...begrunnelseValidation}
            />
            <Radio
                radioRef={ref}
                label="Arbeidsgiver har innrapportert feil til A-ordningen"
                value="Arbeidsgiver har innrapportert feil til A-ordningen"
                {...begrunnelseValidation}
            />
            {form.formState.errors['begrunnelse'] && (
                <ErrorMessage>{form.formState.errors['begrunnelse'].message}</ErrorMessage>
            )}
        </Fieldset>
    );
};
