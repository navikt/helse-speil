import styled from '@emotion/styled';
import { Inntektskildetype, OmregnetÅrsinntekt } from 'internal-types';
import React from 'react';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { somPenger } from '../../../../utils/locale';

const Tabell = styled.div`
    display: grid;
    grid-template-columns: 200px auto;
    grid-column-gap: 1rem;
    grid-row-gap: 0.25rem;
`;

interface ReadOnlyInntektProps {
    omregnetÅrsinntekt?: OmregnetÅrsinntekt;
}

export const ReadOnlyInntekt = ({ omregnetÅrsinntekt }: ReadOnlyInntektProps) => (
    <Tabell>
        <Normaltekst>Månedsbeløp</Normaltekst>
        <Element>{somPenger(omregnetÅrsinntekt?.månedsbeløp)}</Element>
        <Normaltekst>
            {omregnetÅrsinntekt?.kilde === Inntektskildetype.Infotrygd
                ? 'Sykepengegrunnlag før 6G'
                : 'Omregnet årsinntekt som legges til grunn'}
        </Normaltekst>
        <Element>{somPenger(omregnetÅrsinntekt?.beløp)}</Element>
    </Tabell>
);
