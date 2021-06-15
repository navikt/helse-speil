import styled from '@emotion/styled';
import React from 'react';

import '@navikt/helse-frontend-logg/lib/main.css';

import { Flex, FlexColumn } from '../../../components/Flex';
import { useArbeidsforhold, useArbeidsgivernavn } from '../../../modell/Arbeidsgiver';
import { Tidslinjeperiode, useGjenståendeDager, useMaksdato } from '../../../modell/UtbetalingshistorikkElement';
import { usePersondataSkalAnonymiseres } from '../../../state/person';
import { useOppgavereferanse, useVedtaksperiode } from '../../../state/tidslinje';

import { LoggContainer } from '../logg/LoggContainer';
import { LoggHeader } from '../logg/LoggHeader';
import { LoggListe } from '../logg/LoggListe';
import { Sakslinje } from '../sakslinje/Sakslinje';
import { Utbetalingstabell } from '../utbetaling/utbetalingstabell/Utbetalingstabell';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { VenstreMeny } from '../venstremeny/Venstremeny';

const AutoFlexContainer = styled.div`
    flex: auto;
`;

interface SaksbildeRevurderingProps {
    aktivPeriode: Tidslinjeperiode;
}

const Content = styled.div`
    margin: 1rem 2.5rem 4rem;
    height: 100%;
`;

export const SaksbildeRevurdering = ({ aktivPeriode }: SaksbildeRevurderingProps) => {
    const arbeidsgivernavn = useArbeidsgivernavn(aktivPeriode.organisasjonsnummer) ?? 'Ukjent';
    const maksdato = useMaksdato(aktivPeriode.beregningId);
    const gjenståendeDager = useGjenståendeDager(aktivPeriode.beregningId);
    const arbeidsforhold = useArbeidsforhold(aktivPeriode.organisasjonsnummer) ?? [];
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);

    return (
        <Flex
            justifyContent="space-between"
            data-testid="saksbilde-revurdering"
            style={{ minWidth: 'var(--speil-total-min-width)' }}
        >
            <AutoFlexContainer>
                <Sakslinje aktivPeriode={aktivPeriode} />
                <Flex flex={1}>
                    <VenstreMeny
                        aktivPeriode={aktivPeriode}
                        maksdato={maksdato}
                        arbeidsgivernavn={arbeidsgivernavn}
                        organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                        arbeidsforhold={arbeidsforhold}
                        anonymiseringEnabled={anonymiseringEnabled}
                    />
                    <FlexColumn style={{ flex: 1, height: '100%' }}>
                        <Saksbildevarsler
                            aktivPeriode={aktivPeriode}
                            vedtaksperiode={vedtaksperiode}
                            oppgavereferanse={oppgavereferanse}
                        />
                        <Content>
                            <Flex style={{ height: '100%' }}>
                                <Utbetalingstabell
                                    maksdato={maksdato}
                                    periode={aktivPeriode}
                                    gjenståendeDager={gjenståendeDager}
                                    overstyringer={vedtaksperiode.overstyringer}
                                />
                            </Flex>
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
