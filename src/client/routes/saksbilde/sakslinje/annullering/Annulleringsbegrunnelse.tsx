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
    const { formState, clearErrors, watch } = useFormContext();
    const begrunnelserWatch = watch(`begrunnelser`);
    const begrunnelser = {
        ferie: 'Ferie',
        utenlandsopphold: 'Utenlandsopphold',
        ny_sykmeldingsgrad: 'Ny sykmeldingsgrad',
        feil_skjæringstidspunkt: 'Feil skjæringstidspunkt',
        feil_i_sykepengegrunnlag: 'Feil i sykepengegrunnlag',
        feil_i_inntekt_fra_inntektsmelding: 'Feil i inntekt fra inntektsmelding',
        feil_i_refusjon: 'Feil i refusjon',
        endringen_er_i_en_tidligere_periode: 'Endringen er i en tidligere periode',
        kunne_ikke_revurderes_pga_feil_datagrunnlag:
            'Perioden kunne ikke revurderes fordi det var feil i datagrunnlaget',
        annet: 'Annet',
    };
    const annet = begrunnelserWatch ? begrunnelserWatch.includes('annet') : false;

    return (
        <Container>
            <CheckboxGruppe feil={formState.errors.begrunnelser ? formState.errors.begrunnelser.message : null}>
                <StiliLegende>Årsak til annullering</StiliLegende>
                <AlertStripe type="info" form="inline">
                    Årsakene og begrunnelsen som fylles inn skal brukes til å forbedre løsningen.
                    <br />
                    Du vil ikke finne igjen informasjonen i saksbehandlingssystemet etterpå.
                </AlertStripe>
                <br />
                {Object.entries(begrunnelser).map(([key, value], index) => (
                    <BegrunnelseCheckbox key={index} begrunnelse={key} label={<p>{value}</p>} />
                ))}
            </CheckboxGruppe>
            <Controller
                name="kommentar"
                defaultValue=""
                render={({ field: { value, onChange, ref } }) => (
                    <Textarea
                        name="kommentar"
                        value={value}
                        label={`Begrunnelse ${annet ? '' : '(valgfri)'}`}
                        feil={formState.errors.kommentar ? formState.errors.kommentar.message : null}
                        onChange={(event: ChangeEvent) => {
                            clearErrors('kommentar');
                            onChange(event);
                        }}
                        aria-invalid={formState.errors.kommentar?.message}
                        aria-errormessage={formState.errors.kommentar?.message}
                        placeholder="Gi en kort forklaring på hvorfor du annullerte. &#10;Eksempel: Korrigerte opplysninger om ferie"
                        maxLength={0}
                        textareaRef={ref}
                    />
                )}
            />
        </Container>
    );
};
