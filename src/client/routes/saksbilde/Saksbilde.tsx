import styled from '@emotion/styled';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';

import { ErrorBoundary } from '../../components/ErrorBoundary';
import { LasterPersonlinje, Personlinje } from '../../components/Personlinje';
import { copyString } from '../../components/clipboard/util';
import { Key, useKeyboard } from '../../hooks/useKeyboard';
import { useNavigation } from '../../hooks/useNavigation';
import { useRefreshPersonVedOpptegnelse } from '../../hooks/useRefreshPersonVedOpptegnelse';
import { useRefreshPersonVedUrlEndring } from '../../hooks/useRefreshPersonVedUrlEndring';
import { usePollEtterOpptegnelser } from '../../io/polling';
import { usePerson, usePersondataSkalAnonymiseres } from '../../state/person';
import { useAktivPeriode } from '../../state/tidslinje';
import { ToastObject, useAddToast } from '../../state/toasts';
import { Scopes, useVarselFilter } from '../../state/varsler';

import { SaksbildeFullstendigPeriode } from './saksbilder/SaksbildeFullstendigPeriode';
import { TomtSaksbilde } from './saksbilder/SaksbildeTomt';
import { SaksbildeUfullstendigPeriode } from './saksbilder/SaksbildeUfullstendigPeriode';
import { Sakslinje } from './sakslinje/Sakslinje';
import { LasterTidslinje, Tidslinje } from './tidslinje';
import { Utbetalingshistorikk } from './utbetalingshistorikk/Utbetalingshistorikk';

export const getErrorMelding = (tilstand: Tidslinjetilstand) => {
    const vedtaksperiodetilstandErrorMessage = getVedtaksperiodeTilstandError(tilstand);
    return (error: Error) => {
        return vedtaksperiodetilstandErrorMessage ? (
            vedtaksperiodetilstandErrorMessage
        ) : (
            <Varsel type={Varseltype.Feil}>{error.message}</Varsel>
        );
    };
};

export const getVedtaksperiodeTilstandError = (tilstand: Tidslinjetilstand) => {
    switch (tilstand) {
        case 'venter':
            return (
                <Varsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Dette skyldes at perioden ikke er klar til
                    behandling.
                </Varsel>
            );
        case 'kunFerie':
            return (
                <Varsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun ferie.
                </Varsel>
            );
        case 'kunPermisjon':
            return (
                <Varsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun permisjon.
                </Varsel>
            );
        case 'ingenUtbetaling':
            return (
                <Varsel type={Varseltype.Info}>
                    Kunne ikke vise informasjon om vedtaksperioden. Perioden har ingen utbetaling.
                </Varsel>
            );
        case 'venterPåKiling':
            return <Varsel type={Varseltype.Info}>Ikke klar til behandling - avventer system.</Varsel>;
        case 'ukjent':
            return <Varsel type={Varseltype.Feil}>Kunne ikke lese informasjon om sakens tilstand.</Varsel>;
        default:
            return undefined;
    }
};

const SaksbildeContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    height: max-content;
`;

const kopiertFødelsnummerToast = ({
    message = 'Fødselsnummer er kopiert',
    timeToLiveMs = 3000,
}: Partial<ToastObject>): ToastObject => ({
    key: 'kopierFødselsnummerToastKey',
    message,
    timeToLiveMs,
});

interface SaksbildeSwitchProps {
    personTilBehandling: Person;
}

const SaksbildeSwitch = ({ personTilBehandling }: SaksbildeSwitchProps) => {
    const aktivPeriode = useAktivPeriode();
    const { navigateToNext, navigateToPrevious } = useNavigation();
    const clickPrevious = () => navigateToPrevious?.();
    const clickNext = () => navigateToNext?.();
    const addToast = useAddToast();
    const copyFødselsnummer = () => {
        copyString(personTilBehandling?.fødselsnummer ?? '', false);
        addToast(kopiertFødelsnummerToast({}));
    };
    const { path } = useRouteMatch();

    useKeyboard({
        [Key.Left]: { action: clickPrevious, ignoreIfModifiers: true },
        [Key.Right]: { action: clickNext, ignoreIfModifiers: true },
        [Key.C]: { action: copyFødselsnummer, ignoreIfModifiers: false },
    });

    if (!aktivPeriode) return <TomtSaksbilde />;

    return aktivPeriode.fullstendig ? (
        <SaksbildeFullstendigPeriode
            personTilBehandling={personTilBehandling}
            aktivPeriode={aktivPeriode}
            path={path}
        />
    ) : (
        <SaksbildeUfullstendigPeriode aktivPeriode={aktivPeriode} />
    );
};

const SaksbildeContent = React.memo(() => {
    const personTilBehandling = usePerson();
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    const aktivPeriode = useAktivPeriode();

    useRefreshPersonVedUrlEndring();
    useRefreshPersonVedOpptegnelse();
    usePollEtterOpptegnelser();
    useVarselFilter(Scopes.SAKSBILDE);

    const { path } = useRouteMatch();

    if (!personTilBehandling) return <LasterSaksbilde />;

    return (
        <SaksbildeContainer className="saksbilde">
            <Personlinje person={personTilBehandling} />
            <Tidslinje person={personTilBehandling} />
            {aktivPeriode && <Sakslinje aktivPeriode={aktivPeriode} />}
            <Switch>
                <Route path={`${path}/utbetalingshistorikk`}>
                    <Utbetalingshistorikk person={personTilBehandling} anonymiseringEnabled={anonymiseringEnabled} />
                </Route>
                <Route>
                    <SaksbildeSwitch personTilBehandling={personTilBehandling} />
                </Route>
            </Switch>
        </SaksbildeContainer>
    );
});

const LasterSaksbilde = () => (
    <SaksbildeContainer className="saksbilde" data-testid="laster-saksbilde">
        <LasterPersonlinje />
        <LasterTidslinje />
    </SaksbildeContainer>
);

export const Saksbilde = () => (
    <ErrorBoundary fallback={(error: Error) => <Varsel type={Varseltype.Advarsel}>{error.message}</Varsel>}>
        <React.Suspense fallback={<LasterSaksbilde />}>
            <SaksbildeContent />
        </React.Suspense>
    </ErrorBoundary>
);

export default Saksbilde;
