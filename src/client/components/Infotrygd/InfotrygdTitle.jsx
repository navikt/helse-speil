import React from 'react';
import { useHistory } from 'react-router';

const titleForPath = path => {
    return path === '/' ? 'SPEIL HOVEDMENY' : path.slice(1).toUpperCase();
};

const InfotrygdTitle = () => {
    const { location } = useHistory();

    return <h1>{titleForPath(location.pathname)}</h1>;
};

export default InfotrygdTitle;
