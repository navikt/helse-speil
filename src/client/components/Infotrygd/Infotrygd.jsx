import React, { useEffect, useState } from 'react';
import moment from 'moment';
import InfotrygdMenu from './InfotrygdMenu';
import InfotrygdInput from './InfotrygdInput';
import UtbetalingInfotrygd from './routes/UtbetalingInfotrygd';
import OppsummeringInfotrygd from './routes/OppsummeringInfotrygd';
import SykdomsvilkårInfotrygd from './routes/SykdomsvilkårInfotrygd';
import InngangsvilkårInfotrygd from './routes/InngangsvilkårInfotrygd';
import SykepengeperiodeInfotrygd from './routes/SykepengeperiodeInfotrygd';
import SykepengegrunnlagInfotrygd from './routes/SykepengegrunnlagInfotrygd';
import { BrowserRouter, Route } from 'react-router-dom';
import './Infotrygd.less';
import InfotrygdTitle from './InfotrygdTitle';

const navigate = (value, history) => {
    const path =
        (value === '' && '/') ||
        (value === 'sv' && '/sykdomsvilkår') ||
        (value === 'iv' && '/inngangsvilkår') ||
        (value === 'sg' && '/beregning') ||
        (value === 'sp' && '/periode') ||
        (value === 'ub' && '/utbetaling') ||
        (value === 'os' && '/oppsummering');
    if (path) {
        history?.push?.(path);
    }
};

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
            <BrowserRouter>
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
                <Route exact path="/" component={InfotrygdMenu} />
                <Route path="/sykdomsvilkår" component={SykdomsvilkårInfotrygd} />
                <Route path="/inngangsvilkår" component={InngangsvilkårInfotrygd} />
                <Route path="/beregning" component={SykepengegrunnlagInfotrygd} />
                <Route path="/periode" component={SykepengeperiodeInfotrygd} />
                <Route path="/utbetaling" component={UtbetalingInfotrygd} />
                <Route path="/oppsummering" component={OppsummeringInfotrygd} />
                <div className="Infotrygd__footer">
                    <div className="Infotrygd__footer--top">
                        <span>ESC: Tilbake til {moment().format('YYYY')}</span>
                    </div>
                    <div className="Infotrygd__footer--bottom">
                        <span>
                            Rutine/bilde
                            <InfotrygdInput onEnter={navigate} />
                        </span>
                        <div />
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default Infotrygd;
