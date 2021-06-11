import styled from '@emotion/styled';
import React, { ChangeEvent, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox as NavCheckbox, CheckboxGruppe, SkjemaGruppe, Textarea } from 'nav-frontend-skjema';

import { Tidslinjeperiode } from '../../../../../modell/UtbetalingshistorikkElement';
import { useVedtaksperiode } from '../../../../../state/tidslinje';

import { har8_4Kategori } from '../../../vilkår/tilKategoriserteVilkår';
import { Begrunnelse } from './Utbetalingsdialog';

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

const Checkbox = styled(NavCheckbox)`
    .skjemaelement__label {
        margin-bottom: 0.5rem;
    }
    .skjemaelement__label::before {
        width: 22px;
        height: 22px;
    }
`;

const BegrunnelseCheckbox = ({ begrunnelse, label }: { begrunnelse: string; label?: ReactNode }) => {
    const { register, clearErrors } = useFormContext();

    return (
        <Checkbox
            label={label ? label : begrunnelse}
            name={`begrunnelser`}
            value={begrunnelse}
            // @ts-ignore
            checkboxRef={register}
            onChange={() => clearErrors('begrunnelser')}
        />
    );
};

export interface BegrunnelsesskjemaProps {
    aktivPeriode: Tidslinjeperiode;
}

export const Begrunnelsesskjema = ({ aktivPeriode }: BegrunnelsesskjemaProps) => {
    const { errors, clearErrors, watch } = useFormContext();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const warnings = vedtaksperiode?.aktivitetslog;
    const funnetRisikovurderinger = vedtaksperiode?.risikovurdering?.funn;

    const begrunnelser = watch(`begrunnelser`);
    const annet = begrunnelser ? begrunnelser.includes(Begrunnelse.Annet) : false;

    return (
        <Container>
            <CheckboxGruppe
                legend={'Årsak til at saken ikke utbetales i speil'}
                feil={errors.begrunnelser ? errors.begrunnelser.message : null}
            >
                {warnings?.map((advarsel, index) => {
                    switch (advarsel) {
                        case 'Arbeidsuførhet, aktivitetsplikt og/eller medvirkning må vurderes. Se forklaring på vilkårs-siden.':
                            return funnetRisikovurderinger?.filter(har8_4Kategori).map((arbeidsuførhet, index2) => {
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
                                ?.filter((e) => !har8_4Kategori(e))
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
                <BegrunnelseCheckbox begrunnelse={'Annet'} />
            </CheckboxGruppe>
            <Controller
                name="kommentar"
                defaultValue=""
                render={({ value, onChange }) => (
                    <Textarea
                        name="kommentar"
                        value={value}
                        description="Må ikke inneholde personopplysninger"
                        label={`Begrunnelse ${annet ? '' : '(valgfri)'}`}
                        feil={errors.kommentar ? errors.kommentar.message : null}
                        onChange={(event: ChangeEvent) => {
                            clearErrors('kommentar');
                            onChange(event);
                        }}
                        aria-invalid={errors.kommentar?.message}
                        aria-errormessage={errors.kommentar?.message}
                        placeholder="Gi en kort forklaring på hvorfor du avviste utbetalingen. Eksempel: Oppgave om oppfølging"
                        maxLength={0}
                    />
                )}
            />
        </Container>
    );
};
