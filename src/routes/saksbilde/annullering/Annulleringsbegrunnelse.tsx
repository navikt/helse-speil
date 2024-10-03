import React, { ChangeEvent, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Alert, Fieldset, Checkbox as NavCheckbox, Skeleton, Textarea, VStack } from '@navikt/ds-react';

import { useArsaker } from '@external/sanity';

import styles from './Annulleringsmodal.module.scss';

export const Annulleringsbegrunnelse = (): ReactElement => {
    const { register, formState, clearErrors, watch } = useFormContext();
    const begrunnelserWatch: string[] = watch(`begrunnelser`);

    const { arsaker, loading } = useArsaker('annulleringsarsaker');

    const annet = begrunnelserWatch
        ? [...begrunnelserWatch]?.map((it) => JSON.parse(it)).some((it) => it.arsak === 'Annet')
        : false;

    const { onChange: onChangeBegrunnelser, ...begrunnelserValidation } = register('begrunnelser');

    return (
        <div className={styles.annulleringsbegrunnelse}>
            <h3 className={styles.undertittel}>Årsak til annullering</h3>
            <Alert inline variant="info" className={styles.warning}>
                Årsakene og begrunnelsen du fyller ut her finner du ikke igjen i saksbehandlingssystemet etterpå.
                <br />
                Informasjonen brukes til å forbedre løsningen.
            </Alert>

            <Fieldset
                legend="Hvorfor kunne ikke vedtaket revurderes?"
                className={styles.checkboxcontainer}
                error={formState.errors.begrunnelser ? (formState.errors.begrunnelser.message as string) : null}
            >
                {!loading &&
                    arsaker?.[0]?.arsaker.map((årsak) => {
                        return (
                            <NavCheckbox
                                key={årsak._key}
                                value={JSON.stringify(årsak)}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    void onChangeBegrunnelser(event);
                                    clearErrors('begrunnelser');
                                }}
                                {...begrunnelserValidation}
                                className={styles.begrunnelsecheckbox}
                            >
                                <p>{årsak.arsak}</p>
                            </NavCheckbox>
                        );
                    })}
                {loading && (
                    <VStack gap="1" style={{ width: '50%' }}>
                        {Array.from({ length: 20 }, (_, index) => (
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
            <Controller
                name="kommentar"
                defaultValue=""
                render={({ field: { value, onChange } }) => (
                    <Textarea
                        name="kommentar"
                        value={value}
                        label={`Begrunnelse ${annet ? '' : '(valgfri)'}`}
                        error={formState.errors.kommentar ? (formState.errors.kommentar.message as string) : null}
                        onChange={(event: ChangeEvent) => {
                            clearErrors('kommentar');
                            onChange(event);
                        }}
                        description={`Gi en kort forklaring på hvorfor du annullerte.\nEksempel: Korrigerte opplysninger om ferie`}
                        className={styles.begrunnelse}
                    />
                )}
            />
        </div>
    );
};
