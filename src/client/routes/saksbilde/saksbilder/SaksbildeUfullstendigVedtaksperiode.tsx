import { Person } from 'internal-types';
import { Personlinje } from '../../../components/Personlinje';
import { Tidslinje } from '../../../components/tidslinje';
import { Flex } from '../../../components/Flex';
import styled from '@emotion/styled';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import '@navikt/helse-frontend-logg/lib/main.css';

interface SaksbildeUfullstendigVedtaksperiodeProps {
    personTilBehandling: Person;
}

export const SaksbildeUfullstendigVedtaksperiode = ({
    personTilBehandling,
}: SaksbildeUfullstendigVedtaksperiodeProps) => {
    const StyledVarsel = styled(Varsel)`
        width: 100%;
    `;

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: visible;
    `;

    return (
        <Container className="saksbilde" data-testid="saksbilde-ufullstendig-vedtaksperiode">
            <Personlinje person={personTilBehandling} />
            <Switch>
                <Route>
                    <Tidslinje person={personTilBehandling} />
                    <Flex justifyContent="space-between">
                        <StyledVarsel type={Varseltype.Info}>
                            Kunne ikke vise informasjon om vedtaksperioden. Dette skyldes at perioden ikke er klar til
                            behandling.
                        </StyledVarsel>
                    </Flex>
                </Route>
            </Switch>
        </Container>
    );
};
