import { Dagtype, Sykdomsdag } from 'internal-types';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { Flex, FlexColumn } from '../../../components/Flex';
import { Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';
import { nyesteOpptegnelseMedTypeOppgaveState } from '../../../state/opptegnelser';
import { usePerson } from '../../../state/person';
import { useVedtaksperiode } from '../../../state/tidslinje';
import { useAddToast, useRemoveToast } from '../../../state/toasts';

import { OverstyringTimeoutModal } from './OverstyringTimeoutModal';
import { kalkulererToastKey, kalkuleringFerdigToast } from './kalkuleringstoasts';
import { OverstyrbarSykmeldingsperiodetabell } from './sykmeldingsperiodetabell/OverstyrbarSykmeldingsperiodetabell';
import { Sykmeldingsperiodetabell } from './sykmeldingsperiodetabell/Sykmeldingsperiodetabell';

export const trimLedendeArbeidsdager = (sykdomstidslinje: Sykdomsdag[]): Sykdomsdag[] => {
    const førsteIkkearbeidsdag = sykdomstidslinje.findIndex((dag) => dag.type !== Dagtype.Arbeidsdag) ?? 0;
    return sykdomstidslinje.slice(førsteIkkearbeidsdag);
};

const trimLedendeArbeidsdagerNullable = (sykdomstidslinje?: Sykdomsdag[]): Sykdomsdag[] | undefined => {
    return sykdomstidslinje !== undefined ? trimLedendeArbeidsdager(sykdomstidslinje) : undefined;
};

export interface SykmeldingsperiodeProps {
    aktivPeriode: Tidslinjeperiode;
}

export const Sykmeldingsperiode = ({ aktivPeriode }: SykmeldingsperiodeProps) => {
    const person = usePerson();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const [overstyrer, setOverstyrer] = useState(false);
    const [kalkulerer, setKalkulerer] = useState(false);
    const [overstyringTimedOut, setOverstyringTimedOut] = useState(false);
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const opptegnelser = useRecoilValue(nyesteOpptegnelseMedTypeOppgaveState);

    useEffect(() => {
        if (opptegnelser && kalkulerer) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererToastKey) }));
            setKalkulerer(false);
        }
    }, [opptegnelser]);

    useEffect(() => {
        const timeout: NodeJS.Timeout | number | null = kalkulerer
            ? setTimeout(() => setOverstyringTimedOut(true), 10000)
            : null;
        return () => {
            !!timeout && clearTimeout(timeout);
        };
    }, [kalkulerer]);

    return (
        <FlexColumn className="Sykmeldingsperiode">
            <Flex style={{ height: '100%' }}>
                <AgurkErrorBoundary>
                    {overstyrer ? (
                        <OverstyrbarSykmeldingsperiodetabell
                            aktivPeriode={aktivPeriode}
                            onOverstyr={() => {
                                setOverstyrer(false);
                                setKalkulerer(true);
                            }}
                            onToggleOverstyring={() => setOverstyrer((o) => !o)}
                            originaleDager={trimLedendeArbeidsdagerNullable(vedtaksperiode?.sykdomstidslinje)}
                        />
                    ) : (
                        person &&
                        vedtaksperiode && (
                            <Sykmeldingsperiodetabell
                                person={person}
                                aktivPeriode={aktivPeriode}
                                vedtaksperiode={vedtaksperiode}
                                toggleOverstyring={() => setOverstyrer((o) => !o)}
                            />
                        )
                    )}
                </AgurkErrorBoundary>
            </Flex>
            {overstyringTimedOut && <OverstyringTimeoutModal onRequestClose={() => setOverstyringTimedOut(false)} />}
        </FlexColumn>
    );
};
