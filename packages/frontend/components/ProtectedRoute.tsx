import * as React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

import { useAuthentication } from '@state/authentication';

export const ProtectedRoute = ({ children, ...rest }: RouteProps) => {
    const { isLoggedIn } = useAuthentication();

    return <Route {...rest} render={() => (isLoggedIn !== false ? <>{children}</> : <Redirect to="/uautorisert" />)} />;
};
