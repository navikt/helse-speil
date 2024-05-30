import styles from './Annulleringsmodal.module.scss';
import React, { ChangeEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Alert, Fieldset, Checkbox as NavCheckbox, Textarea } from '@navikt/ds-react';

export const Annulleringsbegrunnelse = () => {
    const { register, formState, clearErrors, watch } = useFormContext();
    const begrunnelserWatch = watch(`begrunnelser`);
    const begrunnelser = {
        andre_ytelser: 'Andre ytelser i samme periode',
        annen_teknisk_feil: 'Annen teknisk feil',
        arbeidsgiverperiode_skjæringstidspunkt: 'Arbeidsgiverperiode/skjæringstidspunkt',
        avslåtte_dager: 'Avslåtte dager',
        endring_tidligere_periode: 'Endringen er i en tidligere periode',
        feil_ble_gjort_i_opprinnelig_automatisk_vedtak: 'Feil ble gjort i opprinnelig automatisk vedtak',
        feil_ble_gjort_i_opprinnelig_manuelt_vedtak: 'Feil ble gjort i opprinnelig manuelt vedtak',
        feil_ble_gjort_i_opprinnelig_vedtak_i_infotrygd: 'Feil ble gjort i opprinnelig vedtak i infotrygd',
        feil_i_inntekt_fra_inntektsmelding: 'Feil i inntekt fra inntektsmelding',
        ferie: 'Ferie',
        gjenstående_dager: 'Gjenstående dager (inkludert maksdato)',
        grunnlag_mangler_inntektkilder: 'Flere arbeidsgivere/inntektskilder skal med i grunnlaget',
        periode_forkastet: 'Det vises en informasjonsboble som oppgir at det ikke er mulig å revurdere',
        permisjon: 'Permisjon',
        revurdering_feiler: 'Revurdering feiler',
        sykepengegrunnlag: 'Sykepengegrunnlag',
        sykmeldingsgrad: 'Sykmeldingsgrad',
        utbetaling_av_perioden_skal_til_arbeidsgiver: 'Utbetaling av periode skal til arbeidsgiver',
        utbetaling_av_perioden_skal_til_bruker: 'Utbetaling av perioden skal til bruker',
        utbetalt_infotrygd: 'Periode utbetalt i Infotrygd',
        utenlandsopphold: 'Utenlandsopphold',
        visningsfeil: 'Visningsfeil i vedtak/utbetalingsoversikten',
        yrkesskade: 'Yrkesskade',
        annet: 'Annet',
    };
    const annet = begrunnelserWatch ? begrunnelserWatch.includes('annet') : false;

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
                {Object.entries(begrunnelser).map(([key, value], index) => (
                    <NavCheckbox
                        key={index}
                        value={key}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            onChangeBegrunnelser(event);
                            clearErrors('begrunnelser');
                        }}
                        {...begrunnelserValidation}
                        className={styles.begrunnelsecheckbox}
                    >
                        <p>{value}</p>
                    </NavCheckbox>
                ))}
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
