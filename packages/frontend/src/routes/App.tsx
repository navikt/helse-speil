'use client';

import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

// import 'reset-css';
import { ApolloProvider } from '@apollo/client';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Toasts } from '@components/Toasts';
import { Varsler } from '@components/Varsler';
import { Header } from '@components/header/Header';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useFetchPersonQuery } from '@state/person';
import { useSetVarsler } from '@state/varsler';
import { onLazyLoadFail } from '@utils/error';

import { GlobalFeilside } from './GlobalFeilside';
import { IkkeLoggetInn } from './IkkeLoggetInn';
import { PageNotFound } from './PageNotFound';
import { client } from './apolloClient';
import { AppRoutes } from './index';

import './App.css';

const Saksbilde = dynamic(() =>
    import('./saksbilde/Saksbilde').then((res) => ({ default: res.Saksbilde })).catch(onLazyLoadFail),
);

const Oversikt = dynamic(() =>
    import('./oversikt/Oversikt').then((res) => ({ default: res.Oversikt })).catch(onLazyLoadFail),
);
const GraphQLPlayground = dynamic(() =>
    import('./playground/GraphQLPlayground').then((res) => ({ default: res.GraphQLPlayground })).catch(onLazyLoadFail),
);

ReactModal.setAppElement('#root');

// const telemetryCollectorURL = nais.telemetryCollectorURL;
// console.log(`URL fra nais.ts: ${telemetryCollectorURL}`);
// (erLocal() || !telemetryCollectorURL.includes('localhost')) &&
//     initializeFaro({
//         url: nais.telemetryCollectorURL,
//         app: nais.app,
//         instrumentations: [new ErrorsInstrumentation()],
//     });

const useSyncAlertsToLocation = () => {
    const location = useLocation();
    const setVarsler = useSetVarsler();

    useEffect(() => {
        setVarsler((prevState) =>
            prevState.filter(
                (it) => it.scope === location.pathname || (it.name === 'tildeling' && location.pathname !== '/'),
            ),
        );
    }, [location]);
};

export const App = () => {
    const { loading } = useFetchPersonQuery(true);

    useLoadingToast({ isLoading: loading, message: 'Henter person' });

    useSyncAlertsToLocation();

    return (
        <ErrorBoundary fallback={(error) => <GlobalFeilside error={error} />}>
            <Header />
            <Varsler />
            <Routes>
                <Route path={AppRoutes.Uautorisert} element={<IkkeLoggetInn />} />
                <Route
                    path={`${AppRoutes.Oversikt}/*`}
                    element={
                        <React.Suspense fallback={<div />}>
                            <Oversikt />
                        </React.Suspense>
                    }
                />
                <Route
                    path={AppRoutes.Saksbilde}
                    element={
                        <React.Suspense fallback={<div />}>
                            <Saksbilde />
                        </React.Suspense>
                    }
                />
                <Route
                    path={AppRoutes.Playground}
                    element={
                        <React.Suspense fallback={<div />}>
                            <GraphQLPlayground />
                        </React.Suspense>
                    }
                />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Toasts />
        </ErrorBoundary>
    );
};

export const AppWithRoutingAndState = () => (
    <BrowserRouter>
        <RecoilRoot>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </RecoilRoot>
    </BrowserRouter>
);
