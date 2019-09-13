import React from 'react';
import { Route } from 'react-router-dom';
import './MainContentWrapper.css';
import Oversikt from '../pages/Oversikt/Oversikt';
import MainContentWrapper from '../MainContentWrapper/MainContentWrapper';

const AppRoutes = () => {
    return (
        <>
            <Route path={'/'} exact component={Oversikt} />
            <Route
                path={[
                    '/sykdsomsvilkår',
                    '/inngangsvilkår',
                    '/beregning',
                    '/periode',
                    '/utbetaling',
                    '/oppsummering'
                ]}
                exact
                component={MainContentWrapper}
            />
        </>
    );
};

export default AppRoutes;
