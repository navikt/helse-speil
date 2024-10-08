import React from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

import { ErrorMessage } from '@navikt/ds-react';

import { RefusjonFormFields } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/refusjon/hooks/useRefusjonFormField';

interface FeiloppsummeringProps {
    error: Merge<FieldError, FieldErrorsImpl<RefusjonFormFields>> | undefined;
}

export const RefusjonFeiloppsummering = ({ error }: FeiloppsummeringProps) =>
    error != null ? (
        <>
            {error?.fom && <ErrorMessage>{error.fom.message}</ErrorMessage>}
            {error?.tom && <ErrorMessage>{error.tom.message}</ErrorMessage>}
            {error?.beløp && <ErrorMessage>{error.beløp.message}</ErrorMessage>}
        </>
    ) : null;
