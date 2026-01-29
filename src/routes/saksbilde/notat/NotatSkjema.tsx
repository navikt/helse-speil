import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { Button, HStack } from '@navikt/ds-react';

import { NotatFormFields, notatSkjema } from '@/form-schemas/notatSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { NotatType } from '@io/graphql';
import { Notattekstfelt } from '@saksbilde/notat/Notattekstfelt';
import { useNotatkladd } from '@state/notater';

interface NotatSkjemaProps {
    submit: SubmitHandler<NotatFormFields>;
    submitTekst: string;
    vedtaksperiodeId: string;
    skjulNotatFelt: () => void;
    loading: boolean;
    notattype: NotatType;
}

export function NotatSkjema({
    submit,
    submitTekst,
    vedtaksperiodeId,
    skjulNotatFelt,
    loading,
    notattype,
}: NotatSkjemaProps) {
    const notatkladd = useNotatkladd();

    const lagretNotat = notatkladd.finnNotatForVedtaksperiode(vedtaksperiodeId, notattype);

    const lukkNotatfelt = () => {
        notatkladd.fjernNotat(vedtaksperiodeId, notattype);
        skjulNotatFelt();
    };

    const form = useForm<NotatFormFields>({
        resolver: zodResolver(notatSkjema),
        defaultValues: {
            tekst: lagretNotat,
        },
    });

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(function (formFields: NotatFormFields) {
                    submit(formFields);
                    lukkNotatfelt();
                })}
                style={{ width: '100%' }}
            >
                <Notattekstfelt control={form.control} vedtaksperiodeId={vedtaksperiodeId} notatType={notattype} />
                <HStack gap="space-8" align="center" marginBlock="space-16 space-0">
                    <Button size="small" variant="secondary" type="submit" loading={loading}>
                        {submitTekst}
                    </Button>
                    <Button size="small" variant="tertiary" onClick={lukkNotatfelt} type="button">
                        Avbryt
                    </Button>
                </HStack>
            </form>
        </FormProvider>
    );
}
