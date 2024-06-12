import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Loader, Textarea } from '@navikt/ds-react';

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
        <form className={styles.NotatForm} onSubmit={form.handleSubmit(submitForm)} {...formProps}>
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
            <span>
                <Button size="small" disabled={isFetching}>
                    Legg til {isFetching && <Loader size="xsmall" />}
                </Button>
                <Button size="small" variant="secondary" onClick={closeForm} type="button">
                    Avbryt
                </Button>
            </span>
        </form>
    );
};
