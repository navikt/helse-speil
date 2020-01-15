import React, { ReactChild } from 'react';

interface Props {
    children: ReactChild | ReactChild[];
}

const InfotrygdList = ({ children }: Props) => {
    return <ul className="InfotrygdList">{children}</ul>;
};

export default InfotrygdList;
