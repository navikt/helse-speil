import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Arbeidsforhold, Dagtype, Simulering, Tidslinjetilstand } from 'internal-types';
import React from 'react';

import { Tidslinjeperiode, useGjenståendeDager } from '../../../modell/utbetalingshistorikkelement';
import { harOppgave } from '../../../state/tidslinje';
import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_KORT } from '../../../utils/date';

import { ArbeidsgiverCard } from './ArbeidsgiverCard';
import { PeriodeCard } from './PeriodeCard';
import { UtbetalingCard } from './UtbetalingCard';
import { VilkårCard } from './VilkårCard';
import { Utbetaling } from './utbetaling/Utbetaling';

const Container = styled.section`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: var(--speil-venstremeny-width);
    min-width: 19.5rem;
    padding: 2rem 1.5rem;
    border-right: 1px solid var(--navds-color-border);
`;

interface VenstreMenyProps {
    aktivPeriode: Tidslinjeperiode;
    arbeidsgivernavn: string;
    organisasjonsnummer: string;
    arbeidsforhold: Arbeidsforhold[];
    anonymiseringEnabled: boolean;
    over67År: boolean;
    simulering?: Simulering;
    månedsbeløp?: number;
    maksdato?: Dayjs;
    skjæringstidspunkt?: Dayjs;
}

export const VenstreMeny = ({
    aktivPeriode,
    arbeidsgivernavn,
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
    const utbetalingsdagerTotalt = aktivPeriode.utbetalingstidslinje.filter((dag) => dag.type === Dagtype.Syk).length;
    const ikkeUtbetaltEnda = harOppgave(aktivPeriode) || aktivPeriode.tilstand === Tidslinjetilstand.Venter;

    return (
        <Container>
            <PeriodeCard
                aktivPeriode={aktivPeriode}
                maksdato={maksdato?.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent maksdato'}
                skjæringstidspunkt={skjæringstidspunkt?.format(NORSK_DATOFORMAT) ?? 'Ukjent skjæringstidspunkt'}
                gjenståendeDager={gjenståendeDager}
                over67år={over67År}
            />
            <ArbeidsgiverCard
                arbeidsgivernavn={arbeidsgivernavn}
                organisasjonsnummer={organisasjonsnummer}
                arbeidsforhold={arbeidsforhold}
                anonymiseringEnabled={anonymiseringEnabled}
                månedsbeløp={månedsbeløp}
            />
            <VilkårCard aktivPeriode={aktivPeriode} />
            <UtbetalingCard
                beregningId={aktivPeriode.beregningId}
                ikkeUtbetaltEnda={ikkeUtbetaltEnda}
                utbetalingsdagerTotalt={utbetalingsdagerTotalt}
                simulering={simulering}
                anonymiseringEnabled={anonymiseringEnabled}
            />
            <Utbetaling aktivPeriode={aktivPeriode} />
        </Container>
    );
};
