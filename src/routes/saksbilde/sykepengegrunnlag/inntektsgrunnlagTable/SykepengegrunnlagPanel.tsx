import React, { Dispatch, SetStateAction } from 'react';

import { Alert, Box } from '@navikt/ds-react';

import {
    ArbeidsgiverFragment,
    Arbeidsgiverinntekt,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Maybe,
    PersonFragment,
    Sykepengegrunnlagsgrense,
    VilkarsgrunnlagAvviksvurdering,
} from '@io/graphql';
import { SykepengegrunnlagsgrenseView } from '@saksbilde/sykepengegrunnlag/inntektsgrunnlagTable/sykepengegrunnlagsgrenseView/SykepengegrunnlagsgrenseView';

import { SkjønnsfastsettingSykepengegrunnlag } from '../skjønnsfastsetting/SkjønnsfastsettingSykepengegrunnlag';
import { InntektsgrunnlagTable } from './InntektsgrunnlagTable';
import { InntektsgrunnlagoppsummeringTable } from './InntektsgrunnlagoppsummeringTable';

import styles from './SykepengegrunnlagPanel.module.css';

interface SykepengegrunnlagPanelProps {
    inntekter: Arbeidsgiverinntekt[];
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    avviksvurdering: Maybe<VilkarsgrunnlagAvviksvurdering>;
    sykepengegrunnlag: number;
    setAktivInntektskilde: Dispatch<SetStateAction<Arbeidsgiverinntekt>>;
    aktivInntektskilde?: Arbeidsgiverinntekt;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    person: PersonFragment;
    periode: BeregnetPeriodeFragment | GhostPeriodeFragment;
    organisasjonsnummer: string;
}

// Inntekter fra vilkårsgrunnlaget er ikke nødvendigvis i samme rekkefølge som arbeidsgiverne på personen. Det er viktig
// at arbeidsgiverne vises i samme rekkefølge på sykepengegrunnlag-fanen som i tidslinja.
const getSorterteInntekter = (
    inntekter: Arbeidsgiverinntekt[],
    arbeidsgivere: ArbeidsgiverFragment[],
): Arbeidsgiverinntekt[] => {
    const orgnumre = arbeidsgivere.map((ag) => ag.organisasjonsnummer);

    const inntekterFraAndre = inntekter.filter((inntekt) => !orgnumre.includes(inntekt.arbeidsgiver));
    const sortereKjenteInntekter = orgnumre
        .map((orgnummer) => inntekter.find((inntekt) => orgnummer === inntekt.arbeidsgiver))
        .filter((it) => it) as Arbeidsgiverinntekt[];

    return sortereKjenteInntekter.concat(inntekterFraAndre);
};

export const SykepengegrunnlagPanel = ({
    inntekter,
    avviksvurdering,
    sykepengegrunnlag,
    setAktivInntektskilde,
    aktivInntektskilde,
    sykepengegrunnlagsgrense,
    skjønnsmessigFastsattÅrlig,
    person,
    periode,
    organisasjonsnummer,
}: SykepengegrunnlagPanelProps) => {
    return (
        <div className={styles.wrapper}>
            {avviksvurdering !== null ? (
                <>
                    <InntektsgrunnlagTable
                        person={person}
                        inntekter={getSorterteInntekter(inntekter, person.arbeidsgivere)}
                        setAktivInntektskilde={setAktivInntektskilde}
                        aktivInntektskilde={aktivInntektskilde}
                        omregnetÅrsinntekt={Number(avviksvurdering.beregningsgrunnlag)}
                        skjønnsmessigFastsattÅrlig={skjønnsmessigFastsattÅrlig}
                        sammenligningsgrunnlag={Number(avviksvurdering.sammenligningsgrunnlag)}
                    />
                    <InntektsgrunnlagoppsummeringTable
                        omregnetÅrsinntekt={Number(avviksvurdering.beregningsgrunnlag)}
                        sammenligningsgrunnlag={Number(avviksvurdering.sammenligningsgrunnlag)}
                        avviksprosent={Number(avviksvurdering.avviksprosent)}
                    />
                    <SkjønnsfastsettingSykepengegrunnlag
                        person={person}
                        periode={periode}
                        sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                        sykepengegrunnlag={sykepengegrunnlag}
                        omregnetÅrsinntekt={Number(avviksvurdering.beregningsgrunnlag)}
                        sammenligningsgrunnlag={Number(avviksvurdering.sammenligningsgrunnlag)}
                        skjønnsmessigFastsattÅrlig={skjønnsmessigFastsattÅrlig}
                        inntekter={getSorterteInntekter(inntekter, person.arbeidsgivere)}
                        avviksprosent={Number(avviksvurdering.avviksprosent)}
                        organisasjonsnummer={organisasjonsnummer}
                    />
                    <SykepengegrunnlagsgrenseView
                        sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                        omregnetÅrsinntekt={Number(avviksvurdering.beregningsgrunnlag)}
                    />
                </>
            ) : (
                <Box width="655px" padding="4">
                    <Alert inline variant="info">
                        Avviksvurdering er ennå ikke utført av systemet.
                        <br />
                        Sykepengegrunnlaget kan ikke vises.
                    </Alert>
                </Box>
            )}
        </div>
    );
};
