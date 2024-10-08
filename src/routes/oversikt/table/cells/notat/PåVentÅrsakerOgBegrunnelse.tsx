import React, { ReactElement } from 'react';
import { Control, useController, useFormContext } from 'react-hook-form';

import { Fieldset, Checkbox as NavCheckbox, Skeleton, Textarea, VStack } from '@navikt/ds-react';

import { useArsaker } from '@external/sanity';

import styles from './PåVentModal.module.scss';

export const PåVentÅrsakerOgBegrunnelse = (): ReactElement => {
    const { register, formState, clearErrors, watch, control } = useFormContext();
    const { arsaker, loading } = useArsaker('paventarsaker');
    const arsakerWatch: string[] = watch(`arsaker`);

    const erAnnetAvhuket = arsakerWatch
        ? [...arsakerWatch]?.map((it) => JSON.parse(it)).some((it) => it.arsak === 'Annet')
        : false;

    const { onChange: onChangeArsaker, ...arsakerValidation } = register('arsaker');

    const tillattTekstlengde = 1_000;

    return (
        <div className={styles.påventårsak}>
            <Fieldset
                legend="Hvorfor legges saken på vent?"
                hideLegend
                className={styles.checkboxcontainer}
                error={formState.errors.arsaker ? (formState.errors.arsaker.message as string) : null}
            >
                {!loading &&
                    arsaker?.[0]?.arsaker.map((årsak) => {
                        return (
                            <NavCheckbox
                                key={årsak._key}
                                value={JSON.stringify(årsak)}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    onChangeArsaker(event);
                                    clearErrors('arsaker');
                                }}
                                {...arsakerValidation}
                                className={styles.årsakcheckbox}
                            >
                                <p>{årsak.arsak}</p>
                            </NavCheckbox>
                        );
                    })}
                {loading && (
                    <VStack gap="1" style={{ width: '50%' }}>
                        {Array.from({ length: 10 }, (_, index) => (
                            <div
                                key={`skeleton${index}`}
                                style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
                            >
                                <Skeleton variant="rectangle" width="1.5rem" height="1.5rem" />
                                <Skeleton variant="text" height="2.5rem" width="100%" />
                            </div>
                        ))}
                    </VStack>
                )}
            </Fieldset>
            <ControlledTextarea
                control={control}
                tillattTekstlengde={tillattTekstlengde}
                erAnnetAvhuket={erAnnetAvhuket}
            />
        </div>
    );
};

interface ControlledTextareaProps {
    control: Control;
    tillattTekstlengde: number;
    erAnnetAvhuket: boolean;
}

export const ControlledTextarea = ({
    control,
    tillattTekstlengde,
    erAnnetAvhuket,
}: ControlledTextareaProps): ReactElement => {
    const { field, fieldState } = useController({
        control: control,
        name: 'tekst',
        rules: {
            maxLength: {
                value: tillattTekstlengde,
                message: `Det er kun tillatt med ${tillattTekstlengde} tegn`,
            },
            validate: {
                måFyllesUt: (value) =>
                    !erAnnetAvhuket || (value !== undefined && value.length !== 0) || 'Notat må fylles ut',
            },
        },
    });

    return (
        <Textarea
            {...field}
            className={styles.textarea}
            error={fieldState.error?.message}
            label={`Notat ${erAnnetAvhuket ? '' : '(valgfri)'}`}
            description="Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn"
            maxLength={tillattTekstlengde}
        />
    );
};
