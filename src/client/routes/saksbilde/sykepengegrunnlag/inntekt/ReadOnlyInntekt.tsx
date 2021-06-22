import styled from '@emotion/styled';
import { Inntektskildetype, OmregnetÅrsinntekt } from 'internal-types';
import React from 'react';

import { Element, Undertekst } from 'nav-frontend-typografi';

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
        <Undertekst>Månedsbeløp</Undertekst>
        <Element>{somPenger(omregnetÅrsinntekt?.månedsbeløp)}</Element>
        <Undertekst>
            {omregnetÅrsinntekt?.kilde === Inntektskildetype.Infotrygd
                ? 'Sykepengegrunnlag før 6G'
                : 'Omregnet årsinntekt som legges til grunn'}
        </Undertekst>
        <Element>{somPenger(omregnetÅrsinntekt?.beløp)}</Element>
    </Tabell>
);
