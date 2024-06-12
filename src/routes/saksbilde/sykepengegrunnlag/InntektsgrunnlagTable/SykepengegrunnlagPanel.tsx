import React, { Dispatch, SetStateAction } from 'react';

import { ArbeidsgiverFragment, Arbeidsgiverinntekt, PersonFragment, Sykepengegrunnlagsgrense } from '@io/graphql';
import { Maybe } from '@utils/ts';

import { SkjønnsfastsettingSykepengegrunnlag } from '../skjønnsfastsetting/SkjønnsfastsettingSykepengegrunnlag';
import { InntektsgrunnlagTable } from './InntektsgrunnlagTable';
import { InntektsgrunnlagoppsummeringTable } from './InntektsgrunnlagoppsummeringTable';

import styles from './SykepengegrunnlagPanel.module.css';

interface SykepengegrunnlagPanelProps {
    inntekter: Arbeidsgiverinntekt[];
    omregnetÅrsinntekt?: Maybe<number>;
    sammenligningsgrunnlag?: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    avviksprosent?: Maybe<number>;
    sykepengegrunnlag: number;
    setAktivInntektskilde: Dispatch<SetStateAction<Arbeidsgiverinntekt>>;
    aktivInntektskilde?: Arbeidsgiverinntekt;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    person: PersonFragment;
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
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    avviksprosent,
    sykepengegrunnlag,
    setAktivInntektskilde,
    aktivInntektskilde,
    sykepengegrunnlagsgrense,
    skjønnsmessigFastsattÅrlig,
    person,
}: SykepengegrunnlagPanelProps) => {
    return (
        <div className={styles.wrapper}>
            <InntektsgrunnlagTable
                inntekter={getSorterteInntekter(inntekter, person.arbeidsgivere)}
                setAktivInntektskilde={setAktivInntektskilde}
                aktivInntektskilde={aktivInntektskilde}
                omregnetÅrsinntekt={omregnetÅrsinntekt}
                skjønnsmessigFastsattÅrlig={skjønnsmessigFastsattÅrlig}
                sammenligningsgrunnlag={sammenligningsgrunnlag}
            />
            <InntektsgrunnlagoppsummeringTable
                omregnetÅrsinntekt={omregnetÅrsinntekt}
                sammenligningsgrunnlag={sammenligningsgrunnlag}
                avviksprosent={avviksprosent}
            />
            <SkjønnsfastsettingSykepengegrunnlag
                person={person}
                sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                sykepengegrunnlag={sykepengegrunnlag}
                omregnetÅrsinntekt={omregnetÅrsinntekt}
                sammenligningsgrunnlag={sammenligningsgrunnlag}
                skjønnsmessigFastsattÅrlig={skjønnsmessigFastsattÅrlig}
                inntekter={getSorterteInntekter(inntekter, person.arbeidsgivere)}
                avviksprosent={avviksprosent ?? 0}
            />
        </div>
    );
};
