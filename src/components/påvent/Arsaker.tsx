import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox, CheckboxGroup, HStack, Skeleton, VStack } from '@navikt/ds-react';

import { PåVentSkjema } from '@/form-schemas/påVentSkjema';
import { Arsak } from '@external/sanity';

interface ÅrsakerProps {
    årsaker: Arsak[] | undefined;
    årsakerLoading: boolean;
}

export const Arsaker = ({ årsaker, årsakerLoading }: ÅrsakerProps) => {
    const { control } = useFormContext<PåVentSkjema>();
    return (
        <Controller
            control={control}
            name="årsaker"
            render={({ field, fieldState }) => (
                <CheckboxGroup
                    legend="Hvorfor legges oppgaven på vent?"
                    hideLegend
                    error={fieldState.error?.message}
                    value={field.value}
                    onChange={field.onChange}
                >
                    {!årsakerLoading &&
                        årsaker?.map((årsak) => (
                            <Checkbox key={årsak._key} value={årsak.arsak}>
                                {årsak.arsak}
                            </Checkbox>
                        ))}
                    {årsakerLoading && (
                        <VStack gap="space-4" className="w-1/2">
                            {Array.from({ length: 10 }, (_, index) => (
                                <HStack key={`skeleton${index}`} gap="space-16" align="center">
                                    <Skeleton variant="rectangle" width="1.5rem" height="1.5rem" />
                                    <Skeleton variant="text" height="2.5rem" width="100%" />
                                </HStack>
                            ))}
                        </VStack>
                    )}
                </CheckboxGroup>
            )}
        />
    );
};
