import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { Button, HStack, Textarea } from '@navikt/ds-react';

import styles from './LeggTilNyKommentarForm.module.css';

interface LeggTilNyKommentarFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
    label?: string;
    onSubmitForm: (tekst: string) => void;
    closeForm: () => void;
    isFetching: boolean;
    hasError: boolean;
}

export const LeggTilNyKommentarForm = ({
    label = 'Notat',
    onSubmitForm,
    closeForm,
    isFetching,
    hasError,
    ...formProps
}: LeggTilNyKommentarFormProps): ReactElement => {
    const form = useForm();

    const submitForm = () => {
        onSubmitForm(form.getValues().Notattekst);
    };

    return (
        <form className={styles.leggTilNyKommentarForm} onSubmit={form.handleSubmit(submitForm)} {...formProps}>
            <Textarea
                label={label}
                description="Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn."
                aria-invalid={typeof form.formState.errors.Notattekst === 'object'}
                error={
                    (form.formState.errors.Notattekst?.message as string) ??
                    (hasError && 'Det skjedde en feil. Prøv igjen senere.')
                }
                {...form.register('Notattekst', { required: 'Tekstfeltet kan ikke være tomt' })}
            />
            <HStack gap="2" align="center" marginBlock="4 0">
                <Button size="small" variant="secondary" type="submit" loading={isFetching}>
                    Legg til
                </Button>
                <Button size="small" variant="tertiary" type="button" onClick={closeForm}>
                    Avbryt
                </Button>
            </HStack>
        </form>
    );
};
