// @ts-nocheck

import * as React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Redirect, Route, RouteProps } from 'react-router';

const ProtectedRoute = ({ component: Component, ...rest }: RouteProps) => {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <Route {...rest} render={(props) => (isLoggedIn ? <Component {...props} /> : <Redirect to="/uautorisert" />)} />
    );
};

export default ProtectedRoute;
