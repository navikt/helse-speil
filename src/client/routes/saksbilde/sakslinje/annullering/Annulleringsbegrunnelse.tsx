import styled from '@emotion/styled';
import React, { ChangeEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import AlertStripe from 'nav-frontend-alertstriper';
import { CheckboxGruppe, SkjemaGruppe, Textarea } from 'nav-frontend-skjema';

import { BegrunnelseCheckbox } from '../../venstremeny/utbetaling/Begrunnelsesskjema';

const Container = styled(SkjemaGruppe)`
    margin-top: 1.5rem;

    .skjemagruppe .skjemagruppe__legend {
        margin: 1.5rem 0 2rem;
    }

    .skjemaelement.textarea__container .skjemaelement__label {
        font-weight: normal;
    }

    .skjemaelement__input.textarea--medMeta {
        height: 120px !important;
    }
`;

const StiliLegende = styled.div`
    font-size: 1.25rem;
    margin-bottom: 1rem;
`;

export const Annulleringsbegrunnelse = () => {
    const { errors, clearErrors, watch } = useFormContext();
    const begrunnelserWatch = watch(`begrunnelser`);
    const begrunnelser = {
        feil_ble_gjort_i_opprinnelig_automatisk_vedtak: 'Feil ble gjort i opprinnelig automatisk vedtak',
        feil_ble_gjort_i_pprinnelig_manuelt_vedtak: 'Feil ble gjort i opprinnelig manuelt vedtak',
        feil_ble_gjort_i_opprinnelig_vedtak_i_infotrygd: 'Feil ble gjort i opprinnelig vedtak i Infotrygd',
        mottatt_ny_informasjon_etter_behandling: 'Mottatt ny informasjon etter behandling',
        annet: 'Annet',
    };
    const annet = begrunnelserWatch ? begrunnelserWatch.includes('annet') : false;

    return (
        <Container>
            <CheckboxGruppe feil={errors.begrunnelser ? errors.begrunnelser.message : null}>
                <StiliLegende>Årsak til annullering</StiliLegende>
                <AlertStripe type="info" form="inline">
                    Årsakene og begrunnelsen du fyller ut her, finner du ikke igjen i saksbehandlingssystemet etterpå.
                    Informasjonen som legges inn skal brukes til å forbedre tjenesten.
                </AlertStripe>
                <br />
                {Object.entries(begrunnelser).map(([key, value], index) => {
                    return <BegrunnelseCheckbox key={index} begrunnelse={key} label={<p>{value}</p>} />;
                })}
            </CheckboxGruppe>
            <Controller
                name="kommentar"
                defaultValue=""
                render={({ value, onChange }) => (
                    <Textarea
                        name="kommentar"
                        value={value}
                        label={`Begrunnelse ${annet ? '' : '(valgfri)'}`}
                        feil={errors.kommentar ? errors.kommentar.message : null}
                        onChange={(event: ChangeEvent) => {
                            clearErrors('kommentar');
                            onChange(event);
                        }}
                        aria-invalid={errors.kommentar?.message}
                        aria-errormessage={errors.kommentar?.message}
                        placeholder="Gi en kort forklaring på hvorfor du annullerte. &#10;Eksempel: Korrigerte opplysninger om ferie"
                        maxLength={0}
                    />
                )}
            />
        </Container>
    );
};
