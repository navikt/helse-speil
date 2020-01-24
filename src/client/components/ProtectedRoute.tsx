import * as React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Redirect, Route } from 'react-router';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { authInfo } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={props =>
                authInfo.isLoggedIn ? <Component {...props} /> : <Redirect to="/uautorisert" />
            }
        />
    );
};

export default ProtectedRoute;
