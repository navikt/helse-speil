import styled from '@emotion/styled';
import { Checkbox, CheckboxGruppe, Radio, RadioGruppe, SkjemaGruppe, TextareaControlled } from 'nav-frontend-skjema';
import { Begrunnelse, SkjemaBegrunnelser, SkjemaKommentar, SkjemaÅrsak, Årsak } from './useSkjemaState';
import React from 'react';

const StyledRadio = styled(Radio)`
    .skjemaelement__label::before {
        width: 22px;
        height: 22px;
    }
`;

const StyledCheckbox = styled(Checkbox)`
    .skjemaelement__label::before {
        width: 22px;
        height: 22px;
    }
`;

const visCheckboxgruppe = (radioState: Årsak) => radioState === Årsak.Feil || radioState === Årsak.InfotrygdFeil;

interface BegrunnelsesskjemaProps {
    skjemaÅrsak: SkjemaÅrsak;
    skjemaBegrunnelser: SkjemaBegrunnelser;
    skjemaKommentar: SkjemaKommentar;
    leggTilBegrunnelse: (begrunnelse: Begrunnelse) => void;
    fjernBegrunnelse: (begrunnelse: Begrunnelse) => void;
    setValgtÅrsak: (radio: Årsak) => void;
    setKommentar: (kommentar: string) => void;
}

export const Begrunnelsesskjema = ({
    skjemaÅrsak,
    skjemaBegrunnelser,
    skjemaKommentar,
    leggTilBegrunnelse,
    fjernBegrunnelse,
    setValgtÅrsak,
    setKommentar,
}: BegrunnelsesskjemaProps) => {
    const begrunnelser: Begrunnelse[] = [
        { verdi: 'Vilkår ikke oppfylt', kreverKommentar: false },
        { verdi: 'Arbeidsgiverperiode beregnet feil', kreverKommentar: false },
        { verdi: 'Egenmeldingsdager beregnet feil', kreverKommentar: false },
        { verdi: 'Maksdato beregnet feil', kreverKommentar: false },
        { verdi: 'Dagsats beregnet feil', kreverKommentar: false },
        { verdi: 'Sykepengegrunnlag beregnet feil', kreverKommentar: false },
        { verdi: 'Inntektskilder og/eller ytelser tas ikke med i beregningen', kreverKommentar: false },
        { verdi: 'Vilkår om Lovvalg og medlemskap er ikke oppfylt', kreverKommentar: false },
        { verdi: 'Annet', kreverKommentar: true },
    ];

    return (
        <SkjemaGruppe>
            <RadioGruppe legend={'Årsak'} feil={skjemaÅrsak.harFeil ? 'Årsak må velges før saken kan avsluttes' : null}>
                <StyledRadio
                    label={'Feil vurdering og/eller beregning'}
                    name={'årsak'}
                    onChange={() => setValgtÅrsak(Årsak.Feil)}
                />
                <StyledRadio
                    label={'Allerede behandlet i Infotrygd - riktig vurdering'}
                    name={'årsak'}
                    onChange={() => setValgtÅrsak(Årsak.InfotrygdRiktig)}
                />
                <StyledRadio
                    label={'Allerede behandlet i Infotrygd - feil vurdering og/eller beregning'}
                    name={'årsak'}
                    onChange={() => setValgtÅrsak(Årsak.InfotrygdFeil)}
                />
            </RadioGruppe>

            {visCheckboxgruppe(skjemaÅrsak.verdi) && (
                <CheckboxGruppe
                    legend={'Ved feil, huk av for minst én begrunnelse'}
                    feil={skjemaBegrunnelser.harFeil ? 'Ved feil, huk av for minst én begrunnelse' : null}
                >
                    {begrunnelser.map((begrunnelse) => (
                        <StyledCheckbox
                            label={begrunnelse.verdi}
                            key={begrunnelse.verdi}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    leggTilBegrunnelse(begrunnelse);
                                } else {
                                    fjernBegrunnelse(begrunnelse);
                                }
                            }}
                        />
                    ))}
                </CheckboxGruppe>
            )}

            <TextareaControlled
                description={'Må ikke inneholde personopplysninger'}
                feil={skjemaKommentar.harFeil ? 'Skriv en kommentar hvis du velger begrunnelsen annet' : null}
                label={`Kommentar ${skjemaKommentar.obligatorisk ? '' : '(valgfri)'}`}
                maxLength={0}
                defaultValue={''}
                onBlur={(event) => setKommentar(event.target.value)}
            />
        </SkjemaGruppe>
    );
};
