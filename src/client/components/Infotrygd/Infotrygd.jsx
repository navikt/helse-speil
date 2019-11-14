import React, { useEffect, useState } from 'react';
import useLinks, { pages } from '../../hooks/useLinks';
import moment from 'moment';
import InfotrygdMenu from './InfotrygdMenu';
import InfotrygdInput from './InfotrygdInput';
import InfotrygdTitle from './InfotrygdTitle';
import UtbetalingsoversiktInfotrygd from './routes/UtbetalingsoversiktInfotrygd';
import OppsummeringInfotrygd from './routes/OppsummeringInfotrygd';
import SykdomsvilkårInfotrygd from './routes/SykdomsvilkårInfotrygd';
import InngangsvilkårInfotrygd from './routes/InngangsvilkårInfotrygd';
import SykmeldingsperiodeInfotrygd from './routes/SykmeldingsperiodeInfotrygd';
import SykepengegrunnlagInfotrygd from './routes/SykepengegrunnlagInfotrygd';
import { BrowserRouter, Route } from 'react-router-dom';
import './Infotrygd.less';
import InntektskilderInfotrygd from './routes/InntektskilderInfotrygd';

const navigate = (value = '', history, links) => {
    const sanitizedValue = value.toLowerCase();
    const path =
        (sanitizedValue === 'sp' && pages.SYKMELDINGSPERIODE) ||
        (sanitizedValue === 'sv' && pages.SYKDOMSVILKÅR) ||
        (sanitizedValue === 'iv' && pages.INNGANGSVILKÅR) ||
        (sanitizedValue === 'ik' && pages.INNTEKTSKILDER) ||
        (sanitizedValue === 'sg' && pages.SYKEPENGEGRUNNLAG) ||
        (sanitizedValue === 'uo' && pages.UTBETALINGSOVERSIKT) ||
        (sanitizedValue === 'os' && pages.OPPSUMMERING);
    if (sanitizedValue === '') {
        history?.push?.('/');
    } else if (path) {
        history?.push?.(links[path]);
    }
};

const Infotrygd = () => {
    const [currentTime, setCurrentTime] = useState(moment().format('HH:mm'));
    const links = useLinks();

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
                <Route path="/sykmeldingsperiode" component={SykmeldingsperiodeInfotrygd} />
                <Route path="/sykdomsvilkår" component={SykdomsvilkårInfotrygd} />
                <Route path="/inngangsvilkår" component={InngangsvilkårInfotrygd} />
                <Route path="/inntektskilder" component={InntektskilderInfotrygd} />
                <Route path="/sykepengegrunnlag" component={SykepengegrunnlagInfotrygd} />
                <Route path="/utbetalingsoversikt" component={UtbetalingsoversiktInfotrygd} />
                <Route path="/oppsummering" component={OppsummeringInfotrygd} />
                <div className="Infotrygd__footer">
                    <div className="Infotrygd__footer--top">
                        <span>ESC: Tilbake til {moment().format('YYYY')}</span>
                    </div>
                    <div className="Infotrygd__footer--bottom">
                        <span>
                            Rutine/bilde
                            <InfotrygdInput
                                onEnter={(value, history) => navigate(value, history, links)}
                            />
                        </span>
                        <div />
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default Infotrygd;
