import styled from '@emotion/styled';
import React, { ChangeEvent, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox as NavCheckbox, Fieldset, Textarea } from '@navikt/ds-react';

import { useVedtaksperiode } from '../../../../state/tidslinje';

import { Begrunnelse } from './Utbetalingsdialog';

const Container = styled.div`
    margin-top: 1.5rem;
`;

const BegrunnelseBox = styled(Textarea)`
    min-height: 120px;
    white-space: pre-line;
`;

const ÅrsakFieldset = styled(Fieldset)`
    margin-bottom: 2rem;
`;

const Checkbox = styled(NavCheckbox)`
    display: flex;
    padding: 0;
    margin: 0;

    input {
        width: 1.5rem;
        height: 1.5rem;
        left: 0;
    }

    p {
        padding-left: 0.5rem;
    }
`;

export const BegrunnelseCheckbox = ({ begrunnelse, label }: { begrunnelse: string; label?: ReactNode }) => {
    const { register, clearErrors } = useFormContext();

    const { onChange, ...begrunnelserValidation } = register('begrunnelser');

    const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event);
        clearErrors('begrunnelser');
    };

    return (
        <Checkbox value={begrunnelse} onChange={onCheck} {...begrunnelserValidation}>
            {label ? label : begrunnelse}
        </Checkbox>
    );
};

export interface BegrunnelsesskjemaProps {
    aktivPeriode: Tidslinjeperiode;
}

export const Begrunnelsesskjema = ({ aktivPeriode }: BegrunnelsesskjemaProps) => {
    const { formState, clearErrors, watch } = useFormContext();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const warnings = vedtaksperiode?.aktivitetslog;
    const funnetRisikovurderinger = vedtaksperiode?.risikovurdering?.funn;

    const begrunnelser = watch(`begrunnelser`);
    const annet = begrunnelser ? begrunnelser.includes(Begrunnelse.Annet) : false;

    return (
        <Container>
            <ÅrsakFieldset
                legend="Årsak til at saken ikke kan behandles"
                error={formState.errors.begrunnelser ? formState.errors.begrunnelser.message : null}
            >
                {warnings?.map((advarsel, index) => {
                    switch (advarsel) {
                        case 'Arbeidsuførhet, aktivitetsplikt og/eller medvirkning må vurderes. Se forklaring på vilkårs-siden.':
                            return funnetRisikovurderinger
                                ?.filter((it) => it.kategori.includes('8-4'))
                                .map((arbeidsuførhet, index2) => {
                                    return (
                                        <BegrunnelseCheckbox
                                            key={`${index}-${index2}-checkbox`}
                                            begrunnelse={`${advarsel} ${arbeidsuførhet.beskrivelse}`}
                                            label={
                                                <p>
                                                    {advarsel}
                                                    <br />
                                                    {arbeidsuførhet.beskrivelse}
                                                </p>
                                            }
                                        />
                                    );
                                });
                        case 'Faresignaler oppdaget. Kontroller om faresignalene påvirker retten til sykepenger.':
                            return funnetRisikovurderinger
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
                            return <BegrunnelseCheckbox key={`${index}-checkbox`} begrunnelse={advarsel} />;
                    }
                })}
                <BegrunnelseCheckbox begrunnelse="Annet" />
            </ÅrsakFieldset>
            <Controller
                name="kommentar"
                defaultValue=""
                render={({ field: { value, onChange } }) => (
                    <BegrunnelseBox
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
        </Container>
    );
};
