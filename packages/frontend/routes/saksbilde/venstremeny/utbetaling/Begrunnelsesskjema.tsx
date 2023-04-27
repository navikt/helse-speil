import React, { ChangeEvent, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox, Fieldset, Textarea } from '@navikt/ds-react';

import { Faresignal } from '@io/graphql';

import { Begrunnelse } from './AvvisningModal';

import styles from './Begrunnelsesskjema.module.css';

interface BegrunnelseCheckboxProps {
    begrunnelse: string;
    label?: ReactNode;
}

const BegrunnelseCheckbox: React.FC<BegrunnelseCheckboxProps> = ({ begrunnelse, label }) => {
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

const harFunn = (funn?: Maybe<Faresignal[]>): funn is Faresignal[] => {
    return typeof funn === 'object';
};

interface BegrunnelsesskjemaProps {
    activePeriod: FetchedBeregnetPeriode;
}

export const Begrunnelsesskjema: React.FC<BegrunnelsesskjemaProps> = ({ activePeriod }) => {
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
                {activePeriod.risikovurdering &&
                    harFunn(activePeriod.risikovurdering.funn) &&
                    activePeriod.risikovurdering.funn.length > 0 &&
                    activePeriod.risikovurdering?.funn
                        ?.filter((it) => !it.kategori.includes('8-4'))
                        .map((faresignaler, index2) => {
                            return (
                                <BegrunnelseCheckbox
                                    key={`$risikovurdering-${index2}-checkbox`}
                                    begrunnelse={`\n${faresignaler.beskrivelse}`}
                                />
                            );
                        })}
                {activePeriod.varslerForGenerasjon.map((varsel, index) => {
                    switch (varsel.kode) {
                        case 'SB_RV_2':
                            return activePeriod.risikovurdering?.funn
                                ?.filter((it) => it.kategori.includes('8-4'))
                                .map((_, index2) => {
                                    return (
                                        <BegrunnelseCheckbox
                                            key={`${index}-${index2}-checkbox`}
                                            begrunnelse={`${varsel.tittel}`}
                                            label={<p>{varsel.tittel}</p>}
                                        />
                                    );
                                });
                        default:
                            return <BegrunnelseCheckbox key={`${index}-checkbox`} begrunnelse={varsel.tittel} />;
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
                    />
                )}
            />
        </div>
    );
};
