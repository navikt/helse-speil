import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

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

const Error = styled(Normaltekst)`
    color: var(--navds-color-text-error);
`;

export const Begrunnelser = () => {
    const form = useFormContext();
    return (
        <Fieldset id="begrunnelse" error={form.errors['begrunnelse']}>
            <legend>Begrunnelse</legend>
            <Radio
                radioRef={form.register({ required: 'Velg en begrunnelse' })}
                label="Korrigert inntektsmelding"
                name="begrunnelse"
                value="Korrigert inntektsmelding"
            />
            <Radio
                radioRef={form.register({ required: 'Velg en begrunnelse' })}
                label="Tariffendring"
                name="begrunnelse"
                value="Tariffendring"
            />
            <Radio
                radioRef={form.register({ required: 'Velg en begrunnelse' })}
                label="Arbeidsgiver har oppgitt feil inntekt i inntektsmeldingen"
                name="begrunnelse"
                value="Arbeidsgiver har oppgitt feil inntekt i inntektsmeldingen"
            />
            <Radio
                radioRef={form.register({ required: 'Velg en begrunnelse' })}
                label="Arbeidsgiver har innrapportert feil til A-ordningen"
                name="begrunnelse"
                value="Arbeidsgiver har innrapportert feil til A-ordningen"
            />
            {form.errors['begrunnelse'] && <Error>{form.errors['begrunnelse'].message}</Error>}
        </Fieldset>
    );
};
