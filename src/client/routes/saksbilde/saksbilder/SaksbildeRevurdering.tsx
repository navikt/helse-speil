import styled from '@emotion/styled';
import React from 'react';

import '@navikt/helse-frontend-logg/lib/main.css';
import {Tidslinjeperiode, useGjenståendeDager, useMaksdato} from '../../../modell/UtbetalingshistorikkElement';
import {useArbeidsforhold, useArbeidsgivernavn} from '../../../modell/Arbeidsgiver';
import {LoggHeader} from '../Saksbilde';
import {Utbetalingsoversikt} from '../utbetaling/Utbetalingsoversikt';
import {VenstreMeny, VertikalStrek} from './Felles';
import {usePersondataSkalAnonymiseres} from "../../../state/person";
import {Flex} from "../../../components/Flex";
import {Sakslinje} from "../sakslinje/Sakslinje";

const AutoFlexContainer = styled.div`
    flex: auto;
`;

interface SaksbildeRevurderingProps {
    aktivPeriode: Tidslinjeperiode;
}

const Content = styled.div`
    margin: 0 2.5rem;
    height: 100%;
    width: 100%;
`;

export const SaksbildeRevurdering = ({ aktivPeriode }: SaksbildeRevurderingProps) => {
    const arbeidsgivernavn = useArbeidsgivernavn(aktivPeriode.organisasjonsnummer) ?? 'Ukjent';
    const maksdato = useMaksdato(aktivPeriode.beregningId);
    const gjenståendeDager = useGjenståendeDager(aktivPeriode.beregningId);
    const arbeidsforhold = useArbeidsforhold(aktivPeriode.organisasjonsnummer) ?? [];
    const periode = { fom: aktivPeriode.fom, tom: aktivPeriode.tom };
    const utbetalingstidslinje = aktivPeriode.utbetalingstidslinje;
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    return (
        <Flex justifyContent="space-between" data-testid="saksbilde-revurdering">
            <AutoFlexContainer>
                <Sakslinje
                    aktivVedtaksperiode={false}
                    arbeidsgivernavn={arbeidsgivernavn}
                    arbeidsgiverOrgnr={aktivPeriode.organisasjonsnummer}
                    fom={aktivPeriode.fom}
                    tom={aktivPeriode.tom}
                    skjæringstidspunkt={undefined}
                    maksdato={maksdato}
                    over67År={undefined}
                />
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
                    <Content>
                        <Utbetalingsoversikt
                            maksdato={maksdato}
                            gjenståendeDager={gjenståendeDager}
                            periode={periode}
                            utbetalingstidslinje={utbetalingstidslinje}
                            sykdomstidslinje={aktivPeriode.sykdomstidslinje}
                        />
                    </Content>
                </Flex>
            </AutoFlexContainer>
            <LoggHeader />
        </Flex>
    );
};
