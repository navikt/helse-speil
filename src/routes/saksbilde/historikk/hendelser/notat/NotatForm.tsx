import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Textarea } from '@navikt/ds-react';

import styles from './NotatForm.module.css';

interface NotatFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
    label?: string;
    onSubmitForm: (tekst: string) => void;
    closeForm: () => void;
    isFetching: boolean;
    hasError: boolean;
}

export const NotatForm = ({
    label = 'Notat',
    onSubmitForm,
    closeForm,
    isFetching,
    hasError,
    ...formProps
}: NotatFormProps): ReactElement => {
    const form = useForm();

    const submitForm = () => {
        onSubmitForm(form.getValues().Notattekst);
    };

    return (
        <form className={styles.notatform} onSubmit={form.handleSubmit(submitForm)} {...formProps}>
            <Textarea
                autoFocus
                label={label}
                description="Blir ikke forevist den sykmeldte med mindre den sykmeldte ber om innsyn."
                aria-invalid={typeof form.formState.errors.Notattekst === 'object'}
                error={
                    (form.formState.errors.Notattekst?.message as string) ??
                    (hasError && 'Det skjedde en feil. Prøv igjen senere.')
                }
                {...form.register('Notattekst', { required: 'Tekstfeltet kan ikke være tomt' })}
            />
            <span className={styles.buttons}>
                <Button size="small" variant="secondary" type="submit" loading={isFetching}>
                    Legg til
                </Button>
                <Button size="small" variant="tertiary" type="button" onClick={closeForm}>
                    Avbryt
                </Button>
            </span>
        </form>
    );
};
