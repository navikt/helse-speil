import React, { ChangeEvent, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox, Fieldset, Textarea } from '@navikt/ds-react';

import { BeregnetPeriode } from '@io/graphql';

import { Begrunnelse } from './AvvisningModal';

import styles from './Begrunnelsesskjema.module.css';

interface BegrunnelseCheckboxProps {
    begrunnelse: string;
    label?: ReactNode;
}

const BegrunnelseCheckbox: React.VFC<BegrunnelseCheckboxProps> = ({ begrunnelse, label }) => {
    const { register, clearErrors } = useFormContext();

    const { onChange, ...begrunnelserValidation } = register('begrunnelser');

    const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event);
        clearErrors('begrunnelser');
    };

    return (
        <Checkbox className={styles.Checkbox} value={begrunnelse} onChange={onCheck} {...begrunnelserValidation}>
            {label ? label : begrunnelse}
        </Checkbox>
    );
};

interface BegrunnelsesskjemaProps {
    activePeriod: BeregnetPeriode;
}

export const Begrunnelsesskjema: React.VFC<BegrunnelsesskjemaProps> = ({ activePeriod }) => {
    const { formState, clearErrors, watch } = useFormContext();
    const begrunnelser = watch(`begrunnelser`);
    const annet = begrunnelser ? begrunnelser.includes(Begrunnelse.Annet) : false;

    return (
        <div className={styles.Begrunnelsesskjema}>
            <Fieldset
                className={styles.Fieldset}
                legend="Årsak til at saken ikke kan behandles"
                error={formState.errors.begrunnelser ? formState.errors.begrunnelser.message : null}
            >
                {activePeriod.aktivitetslogg.map((aktivitet, index) => {
                    switch (aktivitet.melding) {
                        case 'Arbeidsuførhet, aktivitetsplikt og/eller medvirkning må vurderes. Se forklaring på vilkårs-siden.':
                            return activePeriod.risikovurdering?.funn
                                ?.filter((it) => it.kategori.includes('8-4'))
                                .map((arbeidsuførhet, index2) => {
                                    return (
                                        <BegrunnelseCheckbox
                                            key={`${index}-${index2}-checkbox`}
                                            begrunnelse={`${aktivitet.melding} ${arbeidsuførhet.beskrivelse}`}
                                            label={
                                                <p>
                                                    {aktivitet.melding}
                                                    <br />
                                                    {arbeidsuførhet.beskrivelse}
                                                </p>
                                            }
                                        />
                                    );
                                });
                        case 'Faresignaler oppdaget. Kontroller om faresignalene påvirker retten til sykepenger.':
                            return activePeriod.risikovurdering?.funn
                                ?.filter((it) => !it.kategori.includes('8-4'))
                                .map((faresignaler, index2) => {
                                    return (
                                        <BegrunnelseCheckbox
                                            key={`${index}-${index2}-checkbox`}
                                            begrunnelse={`\n${faresignaler.beskrivelse}`}
                                        />
                                    );
                                });
                        default:
                            return <BegrunnelseCheckbox key={`${index}-checkbox`} begrunnelse={aktivitet.melding} />;
                    }
                })}
                <BegrunnelseCheckbox begrunnelse="Annet" />
            </Fieldset>
            <Controller
                name="kommentar"
                defaultValue=""
                render={({ field: { value, onChange } }) => (
                    <Textarea
                        className={styles.Textarea}
                        name="kommentar"
                        value={value}
                        label={`Begrunnelse ${annet ? '' : '(valgfri)'}`}
                        error={formState.errors.kommentar ? formState.errors.kommentar.message : null}
                        onChange={(event: ChangeEvent) => {
                            clearErrors('kommentar');
                            onChange(event);
                        }}
                        aria-invalid={formState.errors.kommentar?.message}
                        aria-errormessage={formState.errors.kommentar?.message}
                        description={`Gi en kort forklaring på hvorfor du ikke kan behandle saken.\nEksempel: Oppgave om oppfølging.\nMå ikke inneholde personopplysninger.`}
                        maxLength={0}
                    />
                )}
            />
        </div>
    );
};
