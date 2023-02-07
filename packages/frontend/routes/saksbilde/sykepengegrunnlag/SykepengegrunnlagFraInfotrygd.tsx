import styled from '@emotion/styled';
import React from 'react';

import { Infotrygdvurdering } from '@components/Infotrygdvurdering';
import { VilkarsgrunnlagInfotrygd } from '@io/graphql';
import { getRequiredInntekt } from '@state/selectors/person';

import { SykepengegrunnlagInfotrygd } from './SykepengegrunnlagInfotrygd';
import { Inntekt } from './inntekt/Inntekt';

const Oversikt = styled.div`
    display: flex;
    align-content: space-between;
    gap: 2.5rem;
`;

const Strek = styled.span`
    border-right: 3px solid var(--navds-global-color-gray-200);
`;

interface SykepengegrunnlagFraInfogtrygdProps {
    vilkårsgrunnlag: VilkarsgrunnlagInfotrygd;
    organisasjonsnummer: string;
}

export const SykepengegrunnlagFraInfogtrygd = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
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
                <Inntekt inntekt={inntekt} />
            </Oversikt>
        </Infotrygdvurdering>
    );
};
