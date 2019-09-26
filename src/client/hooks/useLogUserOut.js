import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import fetchIntercept from 'fetch-intercept';

export const useLogUserOut = () => {
    const { setUserLoggedOut } = useContext(AuthContext);

    useEffect(() => {
        fetchIntercept.register({
            response: res => {
                if (res.status === 401) {
                    setUserLoggedOut();
                }
                return res;
            }
        });
    }, []);
};
