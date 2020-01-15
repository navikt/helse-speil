import React, { useEffect, useState } from 'react';
import InfotrygdTitle from '../../InfotrygdTitle';
import moment from 'moment';
import './InfotrygdHeader.less';

const InfotrygdHeader = () => {
    const [currentTime, setCurrentTime] = useState(moment().format('HH:mm'));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(moment().format('HH:mm'));
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="Infotrygd__header--wrapper">
            <div className="Infotrygd__header">
                <div className="Infotrygd__header--left" />
                <InfotrygdTitle />
                <div className="Infotrygd__header--right">
                    <span>Dato: {moment().format('DD/MM-YY')}</span>
                    <span>{`Tid : ${currentTime}`}</span>
                </div>
            </div>
            <hr />
        </div>
    );
};

export default InfotrygdHeader;
