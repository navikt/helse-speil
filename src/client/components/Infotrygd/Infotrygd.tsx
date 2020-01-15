import React from 'react';
import useLinks, { Links, pages } from '../../hooks/useLinks';
import moment from 'moment';
import InfotrygdMenu from './InfotrygdMenu';
import InfotrygdInput from './InfotrygdInput';
import InfotrygdHeader from './components/InfotrygdHeader';
import OppsummeringInfotrygd from './routes/OppsummeringInfotrygd';
import SykdomsvilkårInfotrygd from './routes/SykdomsvilkårInfotrygd';
import InngangsvilkårInfotrygd from './routes/InngangsvilkårInfotrygd';
import InntektskilderInfotrygd from './routes/InntektskilderInfotrygd';
import SykepengegrunnlagInfotrygd from './routes/SykepengegrunnlagInfotrygd';
import SykmeldingsperiodeInfotrygd from './routes/SykmeldingsperiodeInfotrygd';
import UtbetalingsoversiktInfotrygd from './routes/UtbetalingsoversiktInfotrygd';
import { History } from 'history';
import { BrowserRouter, Route } from 'react-router-dom';
import './Infotrygd.less';

const navigate = (value = '', history: History, links: Links) => {
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
    const links = useLinks();

    return (
        <div className="Infotrygd">
            <BrowserRouter>
                <InfotrygdHeader />
                <div className="Infotrygd__content">
                    <Route exact path="/" component={InfotrygdMenu} />
                    <Route path="/sykmeldingsperiode" component={SykmeldingsperiodeInfotrygd} />
                    <Route path="/sykdomsvilkår" component={SykdomsvilkårInfotrygd} />
                    <Route path="/inngangsvilkår" component={InngangsvilkårInfotrygd} />
                    <Route path="/inntektskilder" component={InntektskilderInfotrygd} />
                    <Route path="/sykepengegrunnlag" component={SykepengegrunnlagInfotrygd} />
                    <Route path="/utbetalingsoversikt" component={UtbetalingsoversiktInfotrygd} />
                    <Route path="/oppsummering" component={OppsummeringInfotrygd} />
                </div>
                <div className="Infotrygd__footer">
                    <div className="Infotrygd__footer--top">
                        <span>ESC: Tilbake til {moment().format('YYYY')}</span>
                    </div>
                    <div className="Infotrygd__footer--bottom">
                        <span>
                            Rutine/bilde
                            <InfotrygdInput
                                onEnter={(value: string, history: History) => navigate(value, history, links!)}
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
