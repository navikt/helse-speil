import React, { useEffect, useState } from 'react';
import moment from 'moment';
import './Infotrygd.less';
import InfotrygdMenuItem from './InfotrygdMenuItem';
import InfotrygdInput from './InfotrygdInput';

const Infotrygd = () => {
    const [currentTime, setCurrentTime] = useState(moment().format('HH:mm'));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(moment().format('HH:mm'));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="Infotrygd">
            <div className="Infotrygd__header--wrapper">
                <div className="Infotrygd__header">
                    <div className="Infotrygd__header--left" />
                    <h1>SPEIL HOVEDMENY</h1>
                    <div className="Infotrygd__header--right">
                        <span>Dato: {moment().format('DD/MM-YY')}</span>
                        <span>{`Tid : ${currentTime}`}</span>
                    </div>
                </div>
                <hr />
            </div>
            <div className="Infotrygd__content">
                <ul className="Infotrygd__content--right">
                    <InfotrygdMenuItem abbreviation="SV" label="Sykdomsvilkår" />
                    <InfotrygdMenuItem abbreviation="IV" label="Inngangsvilkår" />
                    <InfotrygdMenuItem abbreviation="SG" label="Sykepengegrunnlag" />
                    <InfotrygdMenuItem abbreviation="SP" label="Sykepengeperiode" />
                    <InfotrygdMenuItem abbreviation="UB" label="Utbetaling" />
                    <InfotrygdMenuItem abbreviation="OS" label="Oppsummering" />
                </ul>
                <ul className="Infotrygd__content-left"></ul>
            </div>
            <div className="Infotrygd__footer">
                <div className="Infotrygd__footer--top">
                    <span>F1: Hjelp</span>
                </div>
                <div className="Infotrygd__footer--bottom">
                    <span>
                        Rutine/bilde
                        <InfotrygdInput onEnter={val => console.log(val)} />
                    </span>
                    <div />
                </div>
            </div>
        </div>
    );
};

export default Infotrygd;
