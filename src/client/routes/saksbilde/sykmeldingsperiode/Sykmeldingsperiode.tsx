import styled from '@emotion/styled';
import { Dagtype, Sykdomsdag } from 'internal-types';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import '@navikt/helse-frontend-tabell/lib/main.css';

import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { nyesteOpptegnelseMedTypeOppgaveState } from '../../../state/opptegnelser';
import { usePerson } from '../../../state/person';
import { useAktivVedtaksperiode } from '../../../state/tidslinje';
import { useAddToast, useRemoveToast } from '../../../state/toasts';

import { OverstyrbarSykmeldingsperiodetabell } from './OverstyrbarSykmeldingsperiodetabell';
import { OverstyringTimeoutModal } from './OverstyringTimeoutModal';
import { Sykmeldingsperiodetabell } from './Sykmeldingsperiodetabell';
import { kalkulererToastKey, kalkuleringFerdigToast } from './kalkuleringstoasts';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
`;

export const trimLedendeArbeidsdager = (sykdomstidslinje: Sykdomsdag[]): Sykdomsdag[] => {
    const førsteIkkearbeidsdag = sykdomstidslinje.findIndex((dag) => dag.type !== Dagtype.Arbeidsdag) ?? 0;
    return sykdomstidslinje.slice(førsteIkkearbeidsdag);
};

const trimLedendeArbeidsdagerNullable = (sykdomstidslinje?: Sykdomsdag[]): Sykdomsdag[] | undefined => {
    return sykdomstidslinje !== undefined ? trimLedendeArbeidsdager(sykdomstidslinje) : undefined;
};

export const Sykmeldingsperiode = () => {
    const person = usePerson();
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    const [overstyrer, setOverstyrer] = useState(false);
    const [kalkulerer, setKalkulerer] = useState(false);
    const [overstyringTimedOut, setOverstyringTimedOut] = useState(false);
    const leggtilEnToast = useAddToast();
    const fjernToast = useRemoveToast();
    const opptegnelser = useRecoilValue(nyesteOpptegnelseMedTypeOppgaveState);

    useEffect(() => {
        if (opptegnelser && kalkulerer) {
            leggtilEnToast(kalkuleringFerdigToast({ callback: () => fjernToast(kalkulererToastKey) }));
            setKalkulerer(false);
        }
    }, [opptegnelser]);

    useEffect(() => {
        let timeoutId: any;
        if (kalkulerer) {
            timeoutId = setTimeout(() => setOverstyringTimedOut(true), 10000);
        }
        return () => {
            !!timeoutId && clearTimeout(timeoutId);
        };
    }, [kalkulerer]);

    return (
        <Container className="Sykmeldingsperiode">
            <AgurkErrorBoundary>
                {overstyrer ? (
                    <OverstyrbarSykmeldingsperiodetabell
                        onOverstyr={() => {
                            setOverstyrer(false);
                            setKalkulerer(true);
                        }}
                        onToggleOverstyring={() => setOverstyrer((o) => !o)}
                        originaleDager={trimLedendeArbeidsdagerNullable(aktivVedtaksperiode?.sykdomstidslinje)}
                    />
                ) : (
                    person &&
                    aktivVedtaksperiode && (
                        <Sykmeldingsperiodetabell
                            person={person}
                            vedtaksperiode={aktivVedtaksperiode}
                            toggleOverstyring={() => setOverstyrer((o) => !o)}
                        />
                    )
                )}
            </AgurkErrorBoundary>
            {overstyringTimedOut && <OverstyringTimeoutModal onRequestClose={() => setOverstyringTimedOut(false)} />}
        </Container>
    );
};
