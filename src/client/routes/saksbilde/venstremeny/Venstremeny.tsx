import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React from 'react';

import { useGjenståendeDager } from '../../../modell/utbetalingshistorikkelement';
import { harOppgave } from '../../../state/tidslinje';
import { NORSK_DATOFORMAT_KORT, tilNorskDato } from '../../../utils/date';

import { ArbeidsgiverCard } from './ArbeidsgiverCard';
import { PeriodeCard } from './PeriodeCard';
import { UtbetalingCard } from './UtbetalingCard';
import { VilkårCard } from './VilkårCard';
import { Utbetaling } from './utbetaling/Utbetaling';

const Container = styled.section`
    grid-area: venstremeny;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-width: var(--speil-venstremeny-width);
    padding: 2rem 1.5rem;
    border-right: 1px solid var(--navds-color-border);
`;

interface VenstreMenyProps {
    aktivPeriode: Tidslinjeperiode;
    organisasjonsnummer: string;
    arbeidsforhold: Arbeidsforhold[];
    anonymiseringEnabled: boolean;
    over67År: boolean;
    simulering?: Vedtaksperiode['simuleringsdata'];
    månedsbeløp?: number;
    maksdato?: Dayjs;
    skjæringstidspunkt: string;
}

export const VenstreMeny = ({
    aktivPeriode,
    organisasjonsnummer,
    arbeidsforhold,
    anonymiseringEnabled,
    over67År,
    simulering,
    månedsbeløp,
    maksdato,
    skjæringstidspunkt,
}: VenstreMenyProps) => {
    const gjenståendeDager = useGjenståendeDager(aktivPeriode.beregningId);
    const utbetalingsdagerTotalt = aktivPeriode.utbetalingstidslinje.filter((dag) => dag.type === 'Syk').length;
    const ikkeUtbetaltEnda = harOppgave(aktivPeriode) || aktivPeriode.tilstand === 'venter';

    return (
        <Container className="Venstremeny">
            <PeriodeCard
                aktivPeriode={aktivPeriode}
                maksdato={maksdato?.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent maksdato'}
                skjæringstidspunkt={tilNorskDato(skjæringstidspunkt)}
                gjenståendeDager={gjenståendeDager}
                over67år={over67År}
            />
            <ArbeidsgiverCard organisasjonsnummer={organisasjonsnummer} månedsbeløp={månedsbeløp} />
            {aktivPeriode.skjæringstidspunkt && aktivPeriode.vilkårsgrunnlaghistorikkId && (
                <VilkårCard
                    aktivPeriode={aktivPeriode}
                    skjæringstidspunkt={aktivPeriode.skjæringstidspunkt}
                    vilkårsgrunnlaghistorikkId={aktivPeriode.vilkårsgrunnlaghistorikkId}
                />
            )}
            {aktivPeriode.skjæringstidspunkt && aktivPeriode.vilkårsgrunnlaghistorikkId && (
                <UtbetalingCard
                    beregningId={aktivPeriode.beregningId}
                    ikkeUtbetaltEnda={ikkeUtbetaltEnda}
                    utbetalingsdagerTotalt={utbetalingsdagerTotalt}
                    simulering={simulering}
                    skjæringstidspunkt={aktivPeriode.skjæringstidspunkt}
                    vilkårsgrunnlaghistorikkId={aktivPeriode.vilkårsgrunnlaghistorikkId}
                    organisasjonsnummer={organisasjonsnummer}
                />
            )}
            <Utbetaling aktivPeriode={aktivPeriode} />
        </Container>
    );
};
