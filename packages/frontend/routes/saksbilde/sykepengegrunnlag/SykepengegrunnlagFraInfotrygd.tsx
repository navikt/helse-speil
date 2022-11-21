import styled from '@emotion/styled';
import React from 'react';

import { Infotrygdvurdering } from '@components/Infotrygdvurdering';
import { Arbeidsforhold, Arbeidsgiverrefusjon, VilkarsgrunnlagInfotrygd } from '@io/graphql';
import { getRequiredInntekt } from '@state/selectors/person';

import { Inntektskilderinnhold } from './Inntektskilderinnhold';
import { SykepengegrunnlagInfotrygd } from './SykepengegrunnlagInfotrygd';

const Oversikt = styled.div`
    display: flex;
    align-content: space-between;
    gap: 2.5rem;
`;

const Strek = styled.span`
    border-right: 1px solid var(--navds-semantic-color-border);
`;

interface SykepengegrunnlagFraInfogtrygdProps {
    vilkårsgrunnlag: VilkarsgrunnlagInfotrygd;
    organisasjonsnummer: string;
    refusjon?: Maybe<Arbeidsgiverrefusjon>;
    arbeidsgivernavn: string;
    bransjer: string[];
    arbeidsforhold: Arbeidsforhold[];
}

export const SykepengegrunnlagFraInfogtrygd = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
    refusjon,
    arbeidsgivernavn,
    bransjer,
    arbeidsforhold,
}: SykepengegrunnlagFraInfogtrygdProps) => {
    const inntekt = getRequiredInntekt(vilkårsgrunnlag, organisasjonsnummer);

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
                />
            </Oversikt>
        </Infotrygdvurdering>
    );
};
