import React from 'react';
import { Button, Loader, Textarea } from '@navikt/ds-react';
import { useForm } from 'react-hook-form';

import styles from './NotatForm.module.css';

interface NotatFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
    label?: string;
    onSubmitForm: (tekst: string) => void;
    closeForm: () => void;
    isFetching: boolean;
    hasError: boolean;
}

export const NotatForm: React.FC<NotatFormProps> = ({
    label = 'Notat',
    onSubmitForm,
    closeForm,
    isFetching,
    hasError,
    ...formProps
}) => {
    const form = useForm();

    const submitForm = () => {
        onSubmitForm(form.getValues().Notattekst);
    };

    return (
        <form className={styles.NotatForm} onSubmit={form.handleSubmit(submitForm)} {...formProps}>
            <Textarea
                label={label}
                description="Blir ikke forevist den sykmeldte med mindre den sykmeldte ber om innsyn."
                aria-invalid={typeof form.formState.errors.Notattekst === 'object'}
                error={
                    form.formState.errors.Notattekst?.message ?? (hasError && 'Det skjedde en feil. Prøv igjen senere.')
                }
                {...form.register('Notattekst', { required: 'Tekstfeltet kan ikke være tomt' })}
            />
            <span>
                <Button size="small">Legg til {isFetching && <Loader size="xsmall" />}</Button>
                <Button size="small" variant="secondary" onClick={closeForm} type="button">
                    Avbryt
                </Button>
            </span>
        </form>
    );
};