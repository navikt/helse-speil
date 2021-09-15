import styled from '@emotion/styled';
import React, { ChangeEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox as NavCheckbox, Fieldset, Textarea } from '@navikt/ds-react';

import { Annulleringsvarsel } from './Annulleringsvarsel';

const Container = styled.div``;

const Undertittel = styled.h3`
    font-size: 1.25rem;
    margin-bottom: 1rem;
    font-weight: 600;
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

    margin-bottom: 2.5rem;
`;

export const Annulleringsbegrunnelse = () => {
    const { register, formState, clearErrors, watch } = useFormContext();
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

    const { onChange: onChangeBegrunnelser, ...begrunnelserValidation } = register('begrunnelser');

    return (
        <Container>
            <Undertittel>Årsak til annullering</Undertittel>
            <Annulleringsvarsel variant="info">
                Årsakene og begrunnelsen som fylles inn skal brukes til å forbedre løsningen.
                <br />
                Du vil ikke finne igjen informasjonen i saksbehandlingssystemet etterpå.
            </Annulleringsvarsel>
            <CheckboxContainer
                legend="Årsak til annullering"
                hideLegend
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
                        placeholder="Gi en kort forklaring på hvorfor du annullerte. &#10;Eksempel: Korrigerte opplysninger om ferie"
                        maxLength={0}
                    />
                )}
            />
        </Container>
    );
};
