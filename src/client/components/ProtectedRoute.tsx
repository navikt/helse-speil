// @ts-nocheck

import * as React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/authentication';

const ProtectedRoute = ({ component: Component, ...rest }: RouteProps) => {
    const { isLoggedIn } = useRecoilValue(authState);

    return (
        <Route {...rest} render={(props) => (isLoggedIn ? <Component {...props} /> : <Redirect to="/uautorisert" />)} />
    );
};

export default ProtectedRoute;
