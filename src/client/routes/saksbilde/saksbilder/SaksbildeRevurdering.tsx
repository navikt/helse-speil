import styled from '@emotion/styled';
import { Vedtaksperiode } from 'internal-types';
import React from 'react';

import '@navikt/helse-frontend-logg/lib/main.css';

import { Flex, FlexColumn } from '../../../components/Flex';
import { NoScrollX } from '../../../components/NoScrollX';
import { useArbeidsforhold, useArbeidsgivernavn } from '../../../modell/Arbeidsgiver';
import { Tidslinjeperiode, useGjenståendeDager, useMaksdato } from '../../../modell/UtbetalingshistorikkElement';
import { usePersondataSkalAnonymiseres } from '../../../state/person';
import { useOppgavereferanse, useVedtaksperiode } from '../../../state/tidslinje';

import { Historikk } from '../historikk/Historikk';
import { Utbetaling } from '../utbetaling/Utbetaling';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { VenstreMeny } from '../venstremeny/Venstremeny';

const AutoFlexContainer = styled.div`
    flex: auto;
`;

const Content = styled.div`
    margin: 0 2.5rem 4rem;
    height: 100%;
`;

interface SaksbildeRevurderingProps {
    aktivPeriode: Tidslinjeperiode;
}

export const SaksbildeRevurdering = ({ aktivPeriode }: SaksbildeRevurderingProps) => {
    const arbeidsgivernavn = useArbeidsgivernavn(aktivPeriode.organisasjonsnummer) ?? 'Ukjent';
    const maksdato = useMaksdato(aktivPeriode.beregningId);
    const gjenståendeDager = useGjenståendeDager(aktivPeriode.beregningId);
    const arbeidsforhold = useArbeidsforhold(aktivPeriode.organisasjonsnummer) ?? [];
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id) as Vedtaksperiode;
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);

    return (
        <Flex
            justifyContent="space-between"
            data-testid="saksbilde-revurdering"
            style={{ minWidth: 'var(--speil-total-min-width)' }}
        >
            <NoScrollX>
                <AutoFlexContainer>
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
                                <Utbetaling
                                    periode={aktivPeriode}
                                    maksdato={maksdato}
                                    vedtaksperiode={vedtaksperiode}
                                    gjenståendeDager={gjenståendeDager}
                                />
                            </Content>
                        </FlexColumn>
                    </Flex>
                </AutoFlexContainer>
                <Historikk />
            </NoScrollX>
        </Flex>
    );
};
