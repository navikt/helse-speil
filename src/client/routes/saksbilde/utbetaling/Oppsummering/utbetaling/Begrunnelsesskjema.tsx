import React, { ChangeEvent } from 'react';
import styled from '@emotion/styled';
import {
    Checkbox as NavCheckbox,
    CheckboxGruppe,
    Radio,
    RadioGruppe,
    SkjemaGruppe,
    Textarea,
} from 'nav-frontend-skjema';
import { Controller, useFormContext } from 'react-hook-form';
import { Begrunnelse, Årsak } from './Utbetalingsdialog';

const Container = styled(SkjemaGruppe)`
    margin-top: 1.5rem;
`;

const RadioButton = styled(Radio)`
    .skjemaelement__label::before {
        width: 22px;
        height: 22px;
    }
`;

const Checkbox = styled(NavCheckbox)`
    .skjemaelement__label::before {
        width: 22px;
        height: 22px;
    }
`;

const BegrunnelseCheckbox = ({ begrunnelse }: { begrunnelse: Begrunnelse }) => {
    const { register, clearErrors } = useFormContext();

    return (
        <Checkbox
            label={begrunnelse}
            name={`begrunnelser.${begrunnelse}`}
            // @ts-ignore
            checkboxRef={register}
            onChange={() => clearErrors('begrunnelser')}
        />
    );
};

export const Begrunnelsesskjema = () => {
    const { register, errors, clearErrors, watch } = useFormContext();
    const årsak = watch('årsak');
    const annet = watch(`begrunnelser.${Begrunnelse.Annet}`);

    const velgerBegrunnelser = (radioState: Årsak) => radioState === Årsak.Feil || radioState === Årsak.InfotrygdFeil;

    return (
        <Container>
            <RadioGruppe legend="Årsak" feil={errors.årsak ? 'Årsak må velges før saken kan avsluttes' : null}>
                <RadioButton
                    label={Årsak.Feil}
                    name="årsak"
                    value={Årsak.Feil}
                    // @ts-ignore
                    radioRef={register({ required: true })}
                    onChange={() => clearErrors()}
                />
                <RadioButton
                    label={Årsak.InfotrygdRiktig}
                    name="årsak"
                    value={Årsak.InfotrygdRiktig}
                    // @ts-ignore
                    radioRef={register({ required: true })}
                    onChange={() => clearErrors()}
                />
                <RadioButton
                    label={Årsak.InfotrygdFeil}
                    name="årsak"
                    value={Årsak.InfotrygdFeil}
                    // @ts-ignore
                    radioRef={register({ required: true })}
                    onChange={() => clearErrors()}
                />
            </RadioGruppe>
            {velgerBegrunnelser(årsak) && (
                <CheckboxGruppe
                    legend={'Ved feil, huk av for minst én begrunnelse'}
                    feil={errors.begrunnelser ? errors.begrunnelser.message : null}
                >
                    <BegrunnelseCheckbox begrunnelse={Begrunnelse.Vilkår} />
                    <BegrunnelseCheckbox begrunnelse={Begrunnelse.Arbeidsgiverperiode} />
                    <BegrunnelseCheckbox begrunnelse={Begrunnelse.Egenmeldingsdager} />
                    <BegrunnelseCheckbox begrunnelse={Begrunnelse.Maksdato} />
                    <BegrunnelseCheckbox begrunnelse={Begrunnelse.Dagsats} />
                    <BegrunnelseCheckbox begrunnelse={Begrunnelse.Sykepengegrunnlag} />
                    <BegrunnelseCheckbox begrunnelse={Begrunnelse.Inntektskilder} />
                    <BegrunnelseCheckbox begrunnelse={Begrunnelse.Medlemskap} />
                    <BegrunnelseCheckbox begrunnelse={Begrunnelse.Faresignaler} />
                    <BegrunnelseCheckbox begrunnelse={Begrunnelse.Arbeidsuførhet} />
                    <BegrunnelseCheckbox begrunnelse={Begrunnelse.Annet} />
                </CheckboxGruppe>
            )}
            <Controller
                name="kommentar"
                defaultValue=""
                render={({ value, onChange }) => (
                    <Textarea
                        name="kommentar"
                        value={value}
                        description="Må ikke inneholde personopplysninger"
                        label={`Kommentar ${annet ? '' : '(valgfri)'}`}
                        feil={errors.kommentar ? errors.kommentar.message : null}
                        onChange={(event: ChangeEvent) => {
                            clearErrors('kommentar');
                            onChange(event);
                        }}
                        aria-invalid={errors.kommentar?.message}
                        aria-errormessage={errors.kommentar?.message}
                        placeholder="Begrunn kort hvorfor saken inneholder feil"
                        maxLength={0}
                    />
                )}
            />
        </Container>
    );
};
