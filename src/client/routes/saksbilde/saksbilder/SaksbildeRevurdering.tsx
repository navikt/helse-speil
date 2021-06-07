import styled from '@emotion/styled';
import React from 'react';

import '@navikt/helse-frontend-logg/lib/main.css';

import { Flex, FlexColumn } from '../../../components/Flex';
import { useArbeidsforhold, useArbeidsgivernavn } from '../../../modell/Arbeidsgiver';
import { Tidslinjeperiode, useGjenståendeDager, useMaksdato } from '../../../modell/UtbetalingshistorikkElement';
import { usePersondataSkalAnonymiseres } from '../../../state/person';
import { useOppgavereferanse, useVedtaksperiode } from '../../../state/tidslinje';

import { Sakslinje } from '../sakslinje/Sakslinje';
import { Utbetalingstabell } from '../utbetaling/Utbetalingstabell';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { VenstreMeny, VertikalStrek } from './Felles';
import { LoggContainer, LoggHeader, LoggListe } from './Logg';

const AutoFlexContainer = styled.div`
    flex: auto;
`;

interface SaksbildeRevurderingProps {
    aktivPeriode: Tidslinjeperiode;
}

const Content = styled.div`
    margin: 0 2.5rem;
    height: 100%;
`;

export const SaksbildeRevurdering = ({ aktivPeriode }: SaksbildeRevurderingProps) => {
    const arbeidsgivernavn = useArbeidsgivernavn(aktivPeriode.organisasjonsnummer) ?? 'Ukjent';
    const maksdato = useMaksdato(aktivPeriode.beregningId);
    const gjenståendeDager = useGjenståendeDager(aktivPeriode.beregningId);
    const arbeidsforhold = useArbeidsforhold(aktivPeriode.organisasjonsnummer) ?? [];
    const periode = { fom: aktivPeriode.fom, tom: aktivPeriode.tom };
    const utbetalingstidslinje = aktivPeriode.utbetalingstidslinje;
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);
    return (
        <Flex justifyContent="space-between" data-testid="saksbilde-revurdering">
            <AutoFlexContainer>
                <Sakslinje aktivPeriode={aktivPeriode} />
                <Flex style={{ height: '100%' }}>
                    <VenstreMeny
                        aktivPeriode={aktivPeriode}
                        maksdato={maksdato}
                        arbeidsgivernavn={arbeidsgivernavn}
                        organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                        arbeidsforhold={arbeidsforhold}
                        anonymiseringEnabled={anonymiseringEnabled}
                    />
                    <VertikalStrek />
                    <FlexColumn style={{ flex: 1, height: '100%' }}>
                        <Saksbildevarsler
                            aktivPeriode={aktivPeriode}
                            vedtaksperiode={vedtaksperiode}
                            oppgavereferanse={oppgavereferanse}
                        />
                        <Content>
                            <Utbetalingstabell
                                maksdato={maksdato}
                                gjenståendeDager={gjenståendeDager}
                                periode={periode}
                                utbetalingstidslinje={utbetalingstidslinje}
                                sykdomstidslinje={aktivPeriode.sykdomstidslinje}
                            />
                        </Content>
                    </FlexColumn>
                </Flex>
            </AutoFlexContainer>
            <LoggContainer>
                <LoggHeader />
                <LoggListe />
            </LoggContainer>
        </Flex>
    );
};
