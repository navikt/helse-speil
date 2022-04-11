import styled from '@emotion/styled';
import React from 'react';

import { Infotrygdvurdering } from '@components/Infotrygdvurdering';

import { Inntektskilderinnhold } from './Inntektskilderinnhold';
import { SykepengegrunnlagInfotrygd } from './SykepengegrunnlagInfotrygd';
import { Arbeidsforhold, Refusjon, VilkarsgrunnlagInfotrygd } from '@io/graphql';
import { getInntekt } from '@state/selectors/person';

const Oversikt = styled.div`
    display: flex;
    align-content: space-between;
    gap: 2.5rem;
`;

const Strek = styled.span`
    border-right: 1px solid var(--navds-color-border);
`;

interface SykepengegrunnlagFraInfogtrygdProps {
    vilkårsgrunnlag: VilkarsgrunnlagInfotrygd;
    organisasjonsnummer: string;
    refusjon?: Maybe<Refusjon>;
    arbeidsgivernavn: string;
    bransjer: string[];
    arbeidsforhold: Arbeidsforhold[];
    skjæringstidspunkt: DateString;
}

export const SykepengegrunnlagFraInfogtrygd = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
    refusjon,
    arbeidsgivernavn,
    bransjer,
    arbeidsforhold,
    skjæringstidspunkt,
}: SykepengegrunnlagFraInfogtrygdProps) => {
    const inntekt = getInntekt(vilkårsgrunnlag, organisasjonsnummer);

    return (
        <Infotrygdvurdering title="Sykepengegrunnlag satt i Infotrygd">
            <Oversikt>
                <SykepengegrunnlagInfotrygd
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    organisasjonsnummer={organisasjonsnummer}
                />
                <Strek />
                <Inntektskilderinnhold
                    inntekt={inntekt}
                    refusjon={refusjon}
                    arbeidsgivernavn={arbeidsgivernavn}
                    bransjer={bransjer}
                    arbeidsforhold={arbeidsforhold}
                    skjæringstidspunkt={skjæringstidspunkt}
                />
            </Oversikt>
        </Infotrygdvurdering>
    );
};
