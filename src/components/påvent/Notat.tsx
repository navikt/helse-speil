import React, { ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Textarea, VStack } from '@navikt/ds-react';

import { PåVentSkjema } from '@/form-schemas/påVentSkjema';
import { VisesIkkeIVedtakTag } from '@components/tags/VisesIkkeIVedtakTag';

interface NotatProps {
    valgfri: boolean;
}

export const Notat = ({ valgfri }: NotatProps): ReactElement => {
    const { control } = useFormContext<PåVentSkjema>();
    return (
        <VStack align="start" className="mt-4 mb-4" gap="space-8">
            <VisesIkkeIVedtakTag />
            <Controller
                control={control}
                name="notattekst"
                render={({ field, fieldState }) => (
                    <Textarea
                        {...field}
                        className="whitespace-pre-line"
                        error={fieldState.error?.message}
                        label={`Notat${valgfri ? ' (valgfri)' : ''}`}
                        description="Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn"
                        maxLength={2_000}
                    />
                )}
            />
        </VStack>
    );
};
