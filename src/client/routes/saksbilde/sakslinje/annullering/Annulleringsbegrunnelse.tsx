import styled from '@emotion/styled';
import React, { ChangeEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox as NavCheckbox, Fieldset, Radio, RadioGroup, Textarea } from '@navikt/ds-react';

import { Annulleringsvarsel } from './Annulleringsvarsel';

const Container = styled.div``;

const Undertittel = styled.h3`
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
`;

const RadioContainer = styled(RadioGroup)`
    margin-bottom: 2.5rem;
`;

const CheckboxContainer = styled(Fieldset)`
    margin-bottom: 0.25rem;

    > .navds-fieldset__error {
        margin-bottom: 1.5rem;
    }
`;

const Checkbox = styled(NavCheckbox)`
    display: flex;
    padding: 0;
    margin: 0 0 20px;

    input {
        width: 1.5rem;
        height: 1.5rem;
        left: 0;
    }

    p {
        padding-left: 0.5rem;
    }
`;

const Begrunnelse = styled(Textarea)`
    textarea {
        padding: 1rem;
    }
    white-space: pre-line;
    margin-bottom: 2.5rem;
`;

export const Annulleringsbegrunnelse = () => {
    const { register, formState, clearErrors, watch } = useFormContext();
    const begrunnelserWatch = watch(`begrunnelser`);
    const begrunnelser = {
        ferie: 'Ferie',
        permisjon: 'Permisjon',
        utenlandsopphold: 'Utenlandsopphold',
        arbeidsgiverperiode: 'Arbeidsgiverperiode',
        avslåtte_dager: 'Avslåtte dager',
        sykmeldingsgrad: 'Sykmeldingsgrad',
        skjæringstidspunkt: 'Skjæringstidspunkt',
        inntekt: 'Inntekt (omregnet årsinntekt)',
        sykepengegrunnlag: 'Sykepengegrunnlag',
        refusjon: 'Refusjon',
        gjenstående_dager: 'Gjenstående dager (inkludert maksdato)',
        knapp_mangler: 'Det vises hverken revurderingsknapp eller informasjonsboble',
        periode_forkastet: 'Det vises en informasjonsboble som oppgir at det mangler datagrunnlag',
        annet: 'Annet',
    };
    const annet = begrunnelserWatch ? begrunnelserWatch.includes('annet') : false;

    const { onChange: onChangeBegrunnelser, ...begrunnelserValidation } = register('begrunnelser');
    const { onChange: onChangeSkjæringstidspunkt, ...skjæringstidspunktValidation } = register(
        'gjelder_siste_skjæringstidspunkt'
    );

    const onChangeRadioButton = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChangeSkjæringstidspunkt(event);
        clearErrors('gjelder_siste_skjæringstidspunkt');
    };
    return (
        <Container>
            <Undertittel>Årsak til annullering</Undertittel>
            <Annulleringsvarsel variant="info" style={{ marginBottom: '2.5rem' }}>
                Årsakene og begrunnelsen du fyller ut her, finner du ikke igjen i saksbehandlingssystemet etterpå.
                <br />
                Informasjonen som fylles inn skal brukes til å forbedre løsningen.
            </Annulleringsvarsel>

            <RadioContainer
                legend="Gjelder endringen det siste skjæringtidspunktet?"
                error={
                    formState.errors.gjelder_siste_skjæringstidspunkt
                        ? formState.errors.gjelder_siste_skjæringstidspunkt.message
                        : null
                }
                name="gjelder_siste_skjæringstidspunkt"
            >
                <Radio
                    value="siste_skjæringstidspunkt"
                    onChange={onChangeRadioButton}
                    {...skjæringstidspunktValidation}
                >
                    Ja, det siste skjæringstidspunktet
                </Radio>
                <Radio
                    value="tidligere_skjæringstidspunkt"
                    onChange={onChangeRadioButton}
                    {...skjæringstidspunktValidation}
                >
                    Nei, et tidligere skjæringstidspunkt
                </Radio>
            </RadioContainer>

            <CheckboxContainer
                legend="Hvorfor kunne ikke vedtaket revurderes?"
                error={formState.errors.begrunnelser ? formState.errors.begrunnelser.message : null}
            >
                {Object.entries(begrunnelser).map(([key, value], index) => (
                    <Checkbox
                        key={index}
                        value={key}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            onChangeBegrunnelser(event);
                            clearErrors('begrunnelser');
                        }}
                        {...begrunnelserValidation}
                    >
                        <p>{value}</p>
                    </Checkbox>
                ))}
            </CheckboxContainer>
            <Controller
                name="kommentar"
                defaultValue=""
                render={({ field: { value, onChange } }) => (
                    <Begrunnelse
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
                        description={`Gi en kort forklaring på hvorfor du annullerte.\nEksempel: Korrigerte opplysninger om ferie`}
                        maxLength={0}
                    />
                )}
            />
        </Container>
    );
};
