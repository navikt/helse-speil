import styled from '@emotion/styled';
import { Simulering } from 'internal-types';
import React, { useState } from 'react';

import Lenke from 'nav-frontend-lenker';
import { Feilmelding, Normaltekst } from 'nav-frontend-typografi';

import { useSykepengegrunnlag } from '../../../state/person';
import { somPenger } from '../../../utils/locale';

import { Card } from './Card';
import { CardTitle } from './CardTitle';
import { SimuleringsinfoModal } from './utbetaling/SimuleringsinfoModal';

const Grid = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.125rem;
    justify-items: flex-start;
`;

const Value = styled(Normaltekst)`
    justify-self: flex-end;
`;

interface UtbetalingCardProps {
    beregningId: string;
    utbetalingsdagerTotalt: number;
    nettobeløp?: number;
    ikkeUtbetaltEnda: boolean;
    simulering?: Simulering;
    anonymiseringEnabled: boolean;
}

export const UtbetalingCard = ({
    beregningId,
    utbetalingsdagerTotalt,
    nettobeløp,
    ikkeUtbetaltEnda,
    simulering,
    anonymiseringEnabled,
}: UtbetalingCardProps) => {
    const sykepengegrunnlag = useSykepengegrunnlag(beregningId);
    const [simuleringÅpen, setSimuleringÅpen] = useState(false);
    return (
        <Card>
            <CardTitle>TIL UTBETALING</CardTitle>
            <Grid>
                <Normaltekst>Sykepengegrunnlag</Normaltekst>
                <Value>{somPenger(sykepengegrunnlag?.sykepengegrunnlag)}</Value>
                <Normaltekst>Utbetalingdager</Normaltekst>
                <Value>{utbetalingsdagerTotalt}</Value>
                <Normaltekst>{ikkeUtbetaltEnda ? 'Beløp til utbetaling' : 'Utbetalt'}</Normaltekst>
                <Value>{nettobeløp ?? 'Ukjent beløp'}</Value>
            </Grid>
            {simulering ? (
                <>
                    <Lenke href="#" onClick={() => setSimuleringÅpen(true)}>
                        Simulering
                    </Lenke>
                    <SimuleringsinfoModal
                        simulering={simulering}
                        åpenModal={simuleringÅpen}
                        lukkModal={() => setSimuleringÅpen(false)}
                        anonymiseringEnabled={anonymiseringEnabled}
                    />
                </>
            ) : (
                <Feilmelding>Mangler simulering</Feilmelding>
            )}
        </Card>
    );
};
