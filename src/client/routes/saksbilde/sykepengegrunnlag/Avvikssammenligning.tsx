import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { somPenger } from '../../../utils/locale';

interface Props {
    avvik?: number;
    totalOmregnetÅrsinntekt?: number;
    totalRapportertÅrsinntekt?: number;
}

const Bold = styled(BodyShort)`
    font-weight: 600;
`;

const Sammenligning = styled.div`
    display: grid;
    grid-template-columns: var(--fixed-column-width) max-content;
    grid-column-gap: 2rem;
    grid-row-gap: 0.5rem;
`;

const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid var(--navds-color-text-primary);
    grid-column-start: 1;
    grid-column-end: 3;
    margin: 0.25rem 0;
`;

export const Avvikssammenligning = ({ avvik, totalOmregnetÅrsinntekt, totalRapportertÅrsinntekt }: Props) => {
    return (
        <Sammenligning>
            <BodyShort>Total omregnet årsinntekt</BodyShort>
            <BodyShort>{somPenger(totalOmregnetÅrsinntekt)}</BodyShort>
            <BodyShort>Total rapportert årsinntekt</BodyShort>
            <BodyShort>{somPenger(totalRapportertÅrsinntekt)}</BodyShort>
            <Divider />
            <Bold component="p">Utregnet avvik</Bold>
            <Bold component="p">{avvik ? `${Math.floor(avvik)} %` : '-'}</Bold>
        </Sammenligning>
    );
};
