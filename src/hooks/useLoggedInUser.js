'use strict';

import { useState, useEffect } from 'react';

const useLoggedInUser = defaultName => {
    const [user, setUser] = useState({ name: defaultName });

    useEffect(() => {
        const nameFromCookie = document.cookie
            .split(';')
            .filter(item => item.trim().startsWith('speil='))
            .map(extractName);

        setUser({ name: nameFromCookie });
    }, [user]);

    return user;
};

const extractName = cookie => {
    const jwt = cookie.split('=')[1];
    try {
        return JSON.parse(atob(jwt.split('.')[1]))['name'];
    } catch (err) {
        console.log(`error while extracting name: ${err}`); // eslint-disable-line no-console
        return null;
    }
};

export default useLoggedInUser;
