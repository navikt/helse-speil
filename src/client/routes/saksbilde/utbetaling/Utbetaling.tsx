import { Dayjs } from 'dayjs';
import { Arbeidsforhold as ArbeidsforholdListe, Periode, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import React from 'react';

import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { Flex } from '../../../components/Flex';
import { usePerson } from '../../../state/person';
import { useAktivPeriode } from '../../../state/tidslinje';

import { Utbetalingsoversikt } from './Utbetalingsoversikt';

export interface UtbetalingProps {
    skjæringstidspunkt?: Dayjs;
    gjenståendeDager?: number;
    maksdato?: Dayjs;
    periode: Periode;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Sykdomsdag[];
    organisasjonsnummer: string;
    arbeidsgivernavn: string;
    arbeidsforhold: ArbeidsforholdListe[];
    månedsbeløp?: number;
}

export const Utbetaling = ({
    gjenståendeDager,
    maksdato,
    periode,
    utbetalingstidslinje,
    sykdomstidslinje,
}: UtbetalingProps) => {
    const aktivPeriode = useAktivPeriode();
    const personTilBehandling = usePerson();
    if (!aktivPeriode || !personTilBehandling) return null;

    return (
        <AgurkErrorBoundary sidenavn="Utbetaling">
            <Flex style={{ height: '100%' }}>
                <Utbetalingsoversikt
                    maksdato={maksdato}
                    gjenståendeDager={gjenståendeDager}
                    periode={periode}
                    utbetalingstidslinje={utbetalingstidslinje}
                    sykdomstidslinje={sykdomstidslinje}
                />
            </Flex>
        </AgurkErrorBoundary>
    );
};
