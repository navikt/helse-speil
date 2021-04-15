import { Person, UfullstendigVedtaksperiode } from 'internal-types';
import { Personlinje } from '../../../components/Personlinje';
import { Tidslinje } from '../../../components/tidslinje';
import { Flex } from '../../../components/Flex';
import styled from '@emotion/styled';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import '@navikt/helse-frontend-logg/lib/main.css';
import { getVedtaksperiodeTilstandError } from '../Saksbilde';

interface SaksbildeUfullstendigVedtaksperiodeProps {
    personTilBehandling: Person;
    aktivVedtaksperiode: UfullstendigVedtaksperiode;
}

export const SaksbildeUfullstendigVedtaksperiode = ({
    personTilBehandling,
    aktivVedtaksperiode,
}: SaksbildeUfullstendigVedtaksperiodeProps) => {
    const ErrorContainer = styled.div`
        width: 100%;
    `;

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: visible;
    `;

    const errorMelding = getVedtaksperiodeTilstandError(aktivVedtaksperiode.tilstand);

    return (
        <Container className="saksbilde" data-testid="saksbilde-ufullstendig-vedtaksperiode">
            <Personlinje person={personTilBehandling} />
            <Switch>
                <Route>
                    <Tidslinje person={personTilBehandling} />
                    <Flex justifyContent="space-between">
                        <ErrorContainer>{errorMelding}</ErrorContainer>
                    </Flex>
                </Route>
            </Switch>
        </Container>
    );
};
