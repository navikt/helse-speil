import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Arbeidsforhold, Dagtype, Vedtaksperiode } from 'internal-types';
import React from 'react';

import { Tidslinjetilstand } from '../../../mapping/arbeidsgiver';
import { Tidslinjeperiode, useGjenståendeDager, useNettobeløp } from '../../../modell/UtbetalingshistorikkElement';
import { harOppgave, useVedtaksperiode } from '../../../state/tidslinje';
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
    width: 340px;
    min-width: 19.5rem;
    padding: 2rem 1.5rem;
    border-right: 1px solid var(--navds-color-border);
`;

interface VenstreMenyProps {
    aktivPeriode: Tidslinjeperiode;
    arbeidsgivernavn: string;
    organisasjonsnummer: string;
    arbeidsforhold: Arbeidsforhold[];
    maksdato?: Dayjs;
    skjæringstidspunkt?: Dayjs;
    anonymiseringEnabled: boolean;
}

export const VenstreMeny = ({
    aktivPeriode,
    maksdato,
    arbeidsgivernavn,
    organisasjonsnummer,
    arbeidsforhold,
    anonymiseringEnabled,
    skjæringstidspunkt,
}: VenstreMenyProps) => {
    const gjenståendeDager = useGjenståendeDager(aktivPeriode.beregningId);
    const utbetalingsdagerTotalt = aktivPeriode.utbetalingstidslinje.filter((dag) => dag.type === Dagtype.Syk).length;
    const nettobeløp = useNettobeløp(aktivPeriode.beregningId);
    const ikkeUtbetaltEnda = harOppgave(aktivPeriode) || aktivPeriode.tilstand === Tidslinjetilstand.Venter;
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id) as Vedtaksperiode;
    const over67år = (vedtaksperiode?.vilkår?.alder.alderSisteSykedag ?? 0) >= 67;
    const månedsbeløp = vedtaksperiode.inntektsgrunnlag?.inntekter?.find(
        (it) => it.organisasjonsnummer === aktivPeriode.organisasjonsnummer
    )?.omregnetÅrsinntekt?.månedsbeløp;

    return (
        <Container>
            <PeriodeCard
                aktivPeriode={aktivPeriode}
                maksdato={maksdato?.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent maksdato'}
                skjæringstidspunkt={skjæringstidspunkt?.format(NORSK_DATOFORMAT) ?? 'Ukjent skjæringstidspunkt'}
                gjenståendeDager={gjenståendeDager}
                over67år={over67år}
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
                nettobeløp={nettobeløp}
                simulering={vedtaksperiode.simuleringsdata}
                anonymiseringEnabled={anonymiseringEnabled}
            />
            <Utbetaling aktivPeriode={aktivPeriode} />
        </Container>
    );
};
