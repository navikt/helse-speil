import React from 'react';
import styled from '@emotion/styled';
import { useRouteMatch } from 'react-router-dom';
import { LoggProvider } from './logg/LoggProvider';
import { LoggHeader as EksternLoggheader } from '@navikt/helse-frontend-logg';
import { Scopes, useVarselFilter } from '../../state/varsler';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { UfullstendigVedtaksperiode, Vedtaksperiode } from 'internal-types';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { usePerson } from '../../state/person';
import { useRefreshPersonVedUrlEndring } from '../../hooks/useRefreshPersonVedUrlEndring';
import { useAktivPeriode } from '../../state/tidslinje';
import { useRefreshPersonVedOpptegnelse } from '../../hooks/useRefreshPersonVedOpptegnelse';
import { usePollEtterOpptegnelser } from '../../io/polling';
import '@navikt/helse-frontend-logg/lib/main.css';
import { erTidslinjeperiode, Tidslinjeperiode } from '../../modell/UtbetalingshistorikkElement';
import { SaksbildeUfullstendigVedtaksperiode } from './saksbilder/SaksbildeUfullstendigVedtaksperiode';
import { LasterSaksbilde } from './saksbilder/SaksbildeLaster';
import { SaksbildeVedtaksperiode } from './saksbilder/SaksbildeVedtaksperiode';
import { SaksbildeRevurdering } from './saksbilder/SaksbildeRevurdering';
import { TomtSaksbilde } from './saksbilder/SaksbildeTomt';

export const SaksbildeContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: visible;
`;

export const LoggHeader = styled(EksternLoggheader)`
    width: 336px;
    box-sizing: border-box;
    box-shadow: inset 0 -1px 0 0 var(--navds-color-border);
    height: 75px;

    & > button {
        min-height: 75px;
    }
`;

const SaksbildeContent = () => {
    const aktivPeriode: Vedtaksperiode | UfullstendigVedtaksperiode | Tidslinjeperiode | undefined = useAktivPeriode();
    const personTilBehandling = usePerson();

    const { path } = useRouteMatch();

    usePollEtterOpptegnelser();
    useVarselFilter(Scopes.SAKSBILDE);
    useRefreshPersonVedUrlEndring();
    useRefreshPersonVedOpptegnelse();

    if (!personTilBehandling) return <LasterSaksbilde />;
    if (!aktivPeriode) return <TomtSaksbilde person={personTilBehandling} />;

    if (erTidslinjeperiode(aktivPeriode)) {
        return (
            <SaksbildeRevurdering
                personTilBehandling={personTilBehandling}
                aktivPeriode={aktivPeriode as Tidslinjeperiode}
            />
        );
    }
    return aktivPeriode.fullstendig ? (
        <SaksbildeVedtaksperiode
            personTilBehandling={personTilBehandling}
            aktivVedtaksperiode={aktivPeriode as Vedtaksperiode}
            path={path}
        />
    ) : (
        <SaksbildeUfullstendigVedtaksperiode personTilBehandling={personTilBehandling} />
    );
};

export const Saksbilde = () => (
    <ErrorBoundary fallback={(error: Error) => <Varsel type={Varseltype.Advarsel}>{error.message}</Varsel>}>
        <React.Suspense fallback={<LasterSaksbilde />}>
            <LoggProvider>
                <SaksbildeContent />
            </LoggProvider>
        </React.Suspense>
    </ErrorBoundary>
);

export default Saksbilde;
