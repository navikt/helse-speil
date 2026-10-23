import React, { Dispatch, SetStateAction } from 'react';

import { Alert, Box } from '@navikt/ds-react';

import {
    ApiArbeidsgiver,
    ApiArbeidsgiverinntekt,
    ApiBeregnetPeriode,
    ApiGhostPeriode,
    ApiSaksbildePerson,
    ApiSykepengegrunnlagsgrense,
    ApiVilkårsgrunnlagAvviksvurdering,
} from '@io/rest/generated/spesialist.schemas';
import { SkjønnsfastsettingSykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/skjonnsfastsetting/SkjønnsfastsettingSykepengegrunnlag';
import { finnAlleArbeidsgivere } from '@state/inntektsforhold/arbeidsgiver';

import { InntektsgrunnlagTable } from './InntektsgrunnlagTable';
import { InntektsgrunnlagoppsummeringTable } from './InntektsgrunnlagoppsummeringTable';

import styles from './SykepengegrunnlagPanel.module.css';

interface SykepengegrunnlagPanelProps {
    vilkårsgrunnlagId: string;
    inntekter: ApiArbeidsgiverinntekt[];
    skjønnsmessigFastsattÅrlig?: number | null;
    avviksvurdering: ApiVilkårsgrunnlagAvviksvurdering | null;
    sykepengegrunnlag: number;
    setAktivInntektskilde: Dispatch<SetStateAction<ApiArbeidsgiverinntekt>>;
    aktivInntektskilde: ApiArbeidsgiverinntekt;
    sykepengegrunnlagsgrense: ApiSykepengegrunnlagsgrense;
    person: ApiSaksbildePerson;
    periode: ApiBeregnetPeriode | ApiGhostPeriode;
    organisasjonsnummer: string;
}

// Inntekter fra vilkårsgrunnlaget er ikke nødvendigvis i samme rekkefølge som arbeidsgiverne på personen. Det er viktig
// at arbeidsgiverne vises i samme rekkefølge på sykepengegrunnlag-fanen som i tidslinja.
const getSorterteInntekter = (
    inntekter: ApiArbeidsgiverinntekt[],
    arbeidsgivere: ApiArbeidsgiver[],
): ApiArbeidsgiverinntekt[] => {
    const orgnumre = arbeidsgivere.map((ag) => ag.organisasjonsnummer);

    const inntekterFraAndre = inntekter.filter((inntekt) => !orgnumre.includes(inntekt.arbeidsgiver));
    const sortereKjenteInntekter = orgnumre
        .map((orgnummer) => inntekter.find((inntekt) => orgnummer === inntekt.arbeidsgiver))
        .filter((it) => it != undefined);

    return sortereKjenteInntekter.concat(inntekterFraAndre);
};

export const SykepengegrunnlagPanel = ({
    vilkårsgrunnlagId,
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
    const arbeidsgivere = finnAlleArbeidsgivere(person);
    return (
        <div className={styles.wrapper}>
            {avviksvurdering !== null ? (
                <>
                    <InntektsgrunnlagTable
                        person={person}
                        inntekter={getSorterteInntekter(inntekter, arbeidsgivere)}
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
                        key={vilkårsgrunnlagId}
                        person={person}
                        periode={periode}
                        vilkårsgrunnlagId={vilkårsgrunnlagId}
                        sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                        sykepengegrunnlag={sykepengegrunnlag}
                        omregnetÅrsinntekt={Number(avviksvurdering.beregningsgrunnlag)}
                        sammenligningsgrunnlag={Number(avviksvurdering.sammenligningsgrunnlag)}
                        skjønnsmessigFastsattÅrlig={skjønnsmessigFastsattÅrlig}
                        inntekter={getSorterteInntekter(inntekter, arbeidsgivere)}
                        avviksprosent={Number(avviksvurdering.avviksprosent)}
                        organisasjonsnummer={organisasjonsnummer}
                    />
                </>
            ) : (
                <Box width="655px" padding="space-16">
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
