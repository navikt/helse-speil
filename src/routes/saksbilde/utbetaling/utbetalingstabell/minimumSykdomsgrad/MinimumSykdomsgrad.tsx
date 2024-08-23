import React, { ReactElement, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { Button, ErrorSummary, Radio, RadioGroup, Textarea } from '@navikt/ds-react';

import { SortInfoikon } from '@components/ikoner/SortInfoikon';

import styles from './MinimumSykdomsgrad.module.scss';

interface MinimumSykdomsgradProps {
    setOverstyrerMinimumSykdomsgrad: (overstyrer: boolean) => void;
}

export const MinimumSykdomsgrad = ({ setOverstyrerMinimumSykdomsgrad }: MinimumSykdomsgradProps): ReactElement => {
    const ref = useRef<HTMLDialogElement>(null);
    const form = useForm();
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const { ...merEnn20Validation } = form.register('MerEnn20', { required: 'Må velge et alternativ' });

    const submitForm = () => {
        console.log(form.getValues());
    };

    return (
        <form className={styles.form} onSubmit={form.handleSubmit(submitForm)}>
            <RadioGroup
                className={styles.radiogroup}
                legend="Er arbeidsevnen nedsatt med minst 20 % basert på arbeidstid?"
                error={form.formState.errors.MerEnn20?.message as string}
                name="MerEnn20"
                size="small"
            >
                <Radio value="Ja" {...merEnn20Validation}>
                    Ja, tap av arbeidstid er mer enn 20%
                </Radio>
                <Radio value="Nei" {...merEnn20Validation}>
                    Nei, tap av arbeidstid er under 20 %
                </Radio>
            </RadioGroup>
            <Textarea
                {...form.register('Begrunnelse', { required: 'Begrunnelse kan ikke være tom' })}
                className={styles.fritekst}
                label={
                    <span className={styles.fritekstlabel}>
                        Begrunnelse{' '}
                        <Button className={styles.button} variant="tertiary" onClick={() => ref.current?.showModal()}>
                            <SortInfoikon />
                        </Button>
                    </span>
                }
                description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                error={form.formState.errors.Begrunnelse?.message as string}
                resize
            />
            {!form.formState.isValid && form.formState.isSubmitted && (
                <div className={styles.feiloppsummering}>
                    <ErrorSummary ref={feiloppsummeringRef} heading="Skjemaet inneholder følgende feil:">
                        {Object.entries(form.formState.errors).map(([id, error]) => (
                            <ErrorSummary.Item key={id}>
                                <>{error ? error.message : undefined}</>
                            </ErrorSummary.Item>
                        ))}
                    </ErrorSummary>
                </div>
            )}
            <span className={styles.buttons}>
                <Button size="small" variant="secondary" type="submit">
                    Lagre
                </Button>
                <Button
                    size="small"
                    variant="tertiary"
                    type="button"
                    onClick={() => setOverstyrerMinimumSykdomsgrad(false)}
                >
                    Avbryt
                </Button>
            </span>
        </form>
    );
};
