import React, { ReactElement, useEffect } from 'react';
import { Control, FormProvider, SubmitHandler, useController, useForm } from 'react-hook-form';

import { Button, ErrorMessage, HStack, Textarea, VStack } from '@navikt/ds-react';

import { KommentarFormFields, kommentarSkjema } from '@/form-schemas/kommentarSkjema';
import { zodResolver } from '@hookform/resolvers/zod';

interface LeggTilNyKommentarFormProps {
    loading: boolean;
    onLeggTilKommentar: SubmitHandler<KommentarFormFields>;
    closeForm: () => void;
    errorMessage?: string;
}

export const LeggTilNyKommentarForm = ({
    errorMessage,
    loading,
    onLeggTilKommentar,
    closeForm,
}: LeggTilNyKommentarFormProps): ReactElement => {
    const form = useForm<KommentarFormFields>({
        resolver: zodResolver(kommentarSkjema),
    });

    useEffect(() => {
        form.setFocus('tekst');
    });

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onLeggTilKommentar)}>
                <VStack>
                    <Kommentartekstfelt control={form.control} />
                    <HStack gap="space-8" align="center" marginBlock="space-16 space-0">
                        <Button size="small" variant="secondary" type="submit" loading={loading}>
                            Legg til
                        </Button>
                        <Button size="small" variant="tertiary" type="button" onClick={closeForm}>
                            Avbryt
                        </Button>
                    </HStack>
                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                </VStack>
            </form>
        </FormProvider>
    );
};

function Kommentartekstfelt({ control }: { control: Control<KommentarFormFields> }) {
    const { field, fieldState } = useController({ name: 'tekst', control: control });

    return (
        <Textarea
            {...field}
            label="Kommentar"
            description="Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn."
            error={fieldState.error?.message}
        />
    );
}
