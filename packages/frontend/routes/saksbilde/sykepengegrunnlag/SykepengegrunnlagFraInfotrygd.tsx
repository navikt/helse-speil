import styled from '@emotion/styled';
import React from 'react';

import { Infotrygdvurdering } from '../../../components/Infotrygdvurdering';

import { Inntektskilderinnhold } from './Inntektskilderinnhold';
import { SykepengegrunnlagInfotrygd } from './SykepengegrunnlagInfotrygd';

const Oversikt = styled.div`
    display: flex;
    align-content: space-between;
    gap: 2.5rem;
`;

const Strek = styled.span`
    border-right: 1px solid var(--navds-color-border);
`;

interface SykepengegrunnlagFraInfogtrygdProps {
    vilkårsgrunnlag: ExternalInfotrygdVilkårsgrunnlag;
    organisasjonsnummer: string;
}

export const SykepengegrunnlagFraInfogtrygd = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
}: SykepengegrunnlagFraInfogtrygdProps) => {
    const inntekt = vilkårsgrunnlag.inntekter.find(
        (it) => it.organisasjonsnummer === organisasjonsnummer
    ) as ExternalArbeidsgiverinntekt;

    return (
        <Infotrygdvurdering title="Sykepengegrunnlag satt i Infotrygd">
            <Oversikt>
                <SykepengegrunnlagInfotrygd
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    organisasjonsnummer={organisasjonsnummer}
                />
                <Strek />
                <Inntektskilderinnhold inntekt={inntekt} />
            </Oversikt>
        </Infotrygdvurdering>
    );
};
