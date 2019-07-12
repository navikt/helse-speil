'use strict';

import { useState, useEffect } from 'react';

const useLoggedInUser = defaultName => {
    const [userNameFromCookie, setUserNameFromCookie] = useState(extractName());

    useEffect(() => {
        setUserNameFromCookie(extractName());
    }, []);

    return { name: userNameFromCookie || defaultName };
};

const extractName = () => {
    return document.cookie
        .split(';')
        .filter(item => item.trim().startsWith('speil='))
        .map(decode)
        .pop();
};

const decode = cookie => {
    const jwt = cookie.split('=')[1];
    try {
        return JSON.parse(atob(jwt.split('.')[1]))['name'];
    } catch (err) {
        console.log(`error while extracting name: ${err}`); // eslint-disable-line no-console
        return null;
    }
};

export default useLoggedInUser;
