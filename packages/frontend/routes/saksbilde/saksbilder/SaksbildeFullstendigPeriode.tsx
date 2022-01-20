import styled from '@emotion/styled';
import React from 'react';

import { ErrorBoundary } from '../../../components/ErrorBoundary';

import { useVarselOmSakErTildeltAnnenSaksbehandler } from '../../../hooks/useVarselOmSakErTildeltAnnenSaksbehandler';

import { useInnloggetSaksbehandler } from '../../../state/authentication';
// import { AmplitudeProvider } from '../AmplitudeContext';
import { getErrorMessage } from '../errorMessages';
import { nanoid } from 'nanoid';
import { SaksbildeFullstendigPeriodeUtenSykefravær } from './SaksbildeFullstendigPeriodeUtenSykefravær';
import { SaksbildeFullstendigPeriodeMedSykefravær } from './SaksbildeFullstendigPeriodeMedSykefravær';

export const RouteContainer = styled.div`
    padding: 0 2rem;
    overflow-x: scroll;
    box-sizing: border-box;
`;

export const Content = styled.div`
    grid-area: content;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-bottom: 4rem;
`;

interface SaksbildeFullstendigPeriodeProps {
    personTilBehandling: Person;
    aktivPeriode: TidslinjeperiodeMedSykefravær | TidslinjeperiodeUtenSykefravær;
}

export const SaksbildeFullstendigPeriode = ({
    personTilBehandling,
    aktivPeriode,
}: SaksbildeFullstendigPeriodeProps) => {
    const errorMelding = getErrorMessage(aktivPeriode.tilstand);
    const saksbehandler = useInnloggetSaksbehandler();
    useVarselOmSakErTildeltAnnenSaksbehandler(saksbehandler.oid, personTilBehandling);

    return (
        <ErrorBoundary key={nanoid()} fallback={errorMelding}>
            {/*</AmplitudeProvider>*/}
            {aktivPeriode.tilstand === 'utenSykefravær' ? (
                <SaksbildeFullstendigPeriodeUtenSykefravær
                    personTilBehandling={personTilBehandling}
                    aktivPeriode={aktivPeriode as TidslinjeperiodeUtenSykefravær}
                />
            ) : (
                <SaksbildeFullstendigPeriodeMedSykefravær
                    personTilBehandling={personTilBehandling}
                    aktivPeriode={aktivPeriode as TidslinjeperiodeMedSykefravær}
                />
            )}
            {/*</AmplitudeProvider>*/}
        </ErrorBoundary>
    );
};
